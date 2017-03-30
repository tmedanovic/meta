import { ModuleWithProviders } from '@angular/core';
import { MetaLoader } from './src/meta.loader';
export * from './src/models/page-title-positioning';
export * from './src/models/meta-settings';
export * from './src/meta.loader';
export * from './src/meta.service';
export * from './src/head.service';
export * from './src/head.static';
export declare function metaFactory(): MetaLoader;
export declare class MetaModule {
    static forRoot(configuredProvider?: any): ModuleWithProviders;
    constructor(parentModule: MetaModule);
}
