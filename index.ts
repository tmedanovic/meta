import { NgModule, ModuleWithProviders } from '@angular/core';

import { MetadataLoader, MetadataStaticLoader, MetadataService } from './src/metadata.service';

export * from './src/models/page-title-positioning';
export * from './src/models/metadata-settings';
export * from './src/metadata.service';

export function metadataLoaderFactory(): MetadataLoader {
    return new MetadataStaticLoader();
}

@NgModule()
export class MetadataModule {
    static forRoot(providedLoader: any = {
                       provide: MetadataLoader,
                       useFactory: (metadataLoaderFactory)
                   }): ModuleWithProviders {
        return {
            ngModule : MetadataModule,
            providers : [
                providedLoader,
                MetadataService
            ]
        };
    }
}
