declare module '@parcel/ts-utils' {
    import { Config, ConfigType, PluginOptions } from '@parcel/types';
    export function loadTSConfig(config: Config, options: PluginOptions): Promise<ConfigType> | ConfigType;
}
