import SourceMap from '@parcel/source-map';
import { Transformer } from '@parcel/plugin';
import { loadTSConfig } from '@parcel/ts-utils';
import ts from 'ttypescript';
const ParcelTtscTransformer = new Transformer({
    async loadConfig({ config, options }) {
        return loadTSConfig(config, options);
    },
    async transform({ asset, config }) {
        asset.type = 'js';
        const filePath = asset.filePath;
        const compilerOptions = {
            jsx: ts.JsxEmit.React,
            ...config,
            noEmit: false,
            module: ts.ModuleKind.ESNext,
        };
        const program = ts.createProgram({
            rootNames: [filePath],
            options: compilerOptions,
        });
        const sourceFile = program.getSourceFile(filePath);
        const fileNameWithoutExt = filePath.replace(/\.ts$/, '');
        let content = '';
        let dts = '';
        let sourcemap;
        program.emit(sourceFile, (fileName, text) => {
            const ext = fileName.slice(fileNameWithoutExt.length);
            switch (ext) {
                case '.js':
                    content = text;
                    break;
                case '.js.map':
                    sourcemap = new SourceMap(compilerOptions.projectRoot);
                    sourcemap.addVLQMap(JSON.parse(text));
                    break;
                case '.d.ts':
                    dts = text;
            }
        });
        const dtsResult = dts
            ? {
                type: 'ts',
                content: dts,
                map: undefined,
            }
            : [];
        return [
            {
                type: 'js',
                content: content,
                map: sourcemap,
            },
        ].concat(dtsResult);
    },
});
export default ParcelTtscTransformer;
//# sourceMappingURL=index.js.map