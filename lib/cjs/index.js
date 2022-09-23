"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var plugin_1 = require("@parcel/plugin");
var ts_utils_1 = require("@parcel/ts-utils");
var source_map_1 = tslib_1.__importDefault(require("@parcel/source-map"));
var ttypescript_1 = tslib_1.__importDefault(require("ttypescript"));
var ParcelTtscTransformer = new plugin_1.Transformer({
    loadConfig: function (_a) {
        var config = _a.config, options = _a.options;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                return [2, (0, ts_utils_1.loadTSConfig)(config, options)];
            });
        });
    },
    transform: function (_a) {
        var asset = _a.asset, config = _a.config;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filePath, compilerOptions, program, sourceFile, fileNameWithoutExt, content, dts, sourcemap, dtsResult;
            return tslib_1.__generator(this, function (_b) {
                console.error(asset);
                asset.type = 'js';
                filePath = asset.filePath;
                compilerOptions = tslib_1.__assign(tslib_1.__assign({ jsx: ttypescript_1.default.JsxEmit.React }, config), { noEmit: false, module: ttypescript_1.default.ModuleKind.ESNext });
                program = ttypescript_1.default.createProgram({
                    rootNames: [filePath],
                    options: compilerOptions
                });
                sourceFile = program.getSourceFile(filePath);
                fileNameWithoutExt = filePath.replace(/\.ts$/, '');
                content = '';
                dts = '';
                program.emit(sourceFile, function (fileName, text) {
                    var ext = fileName.slice(fileNameWithoutExt.length);
                    switch (ext) {
                        case '.js':
                            content = text;
                            break;
                        case '.js.map':
                            sourcemap = new source_map_1.default(compilerOptions.projectRoot);
                            sourcemap.addVLQMap(JSON.parse(text));
                            break;
                        case '.d.ts':
                            dts = text;
                    }
                });
                dtsResult = dts ? {
                    type: 'ts',
                    content: dts,
                    map: undefined
                } : [];
                return [2, [{
                            type: 'js',
                            content: content,
                            map: sourcemap
                        }].concat(dtsResult)];
            });
        });
    }
});
exports.default = ParcelTtscTransformer;
//# sourceMappingURL=index.js.map