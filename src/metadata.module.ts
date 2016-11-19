import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';
import { MetadataService } from './metadata.service';

export function createMetadataSettings() {
    return {
        pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
        defaults : {}
    };
}

@NgModule()
export class MetadataModule {
    static forRoot(metadataSettings: any = {
                       provide: METADATA_SETTINGS,
                       useFactory: (createMetadataSettings)
                   }): ModuleWithProviders {
        return {
            ngModule : MetadataModule,
            providers : [
                metadataSettings,
                MetadataService
            ]
        };
    }
}
