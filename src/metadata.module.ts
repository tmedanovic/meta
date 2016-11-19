import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
//import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';
import { MetadataLoader, MetadataStaticLoader } from './metadata.service';
import { MetadataService } from './metadata.service';

//export function createMetadataSettings() {
//    return {
//        pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
//        defaults : {}
//    };
//}

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
