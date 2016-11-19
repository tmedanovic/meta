import { ModuleWithProviders } from '@angular/core';
import { MetadataStaticLoader } from './metadata.service';
export declare function metadataLoaderFactory(): MetadataStaticLoader;
export declare class MetadataModule {
    static forRoot(providedLoader?: any): ModuleWithProviders;
}
