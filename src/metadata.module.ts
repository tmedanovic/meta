import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
import { MetadataLoader, MetadataStaticLoader, MetadataService } from './metadata.service';

export function metadataLoaderFactory() {
    return new MetadataStaticLoader({
        pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
        defaults : {}
    });
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
