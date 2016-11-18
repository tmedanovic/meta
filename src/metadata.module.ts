import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';
import { MetadataService } from './metadata.service';

@NgModule()
export class MetadataModule {
    static forRoot(metadataSettings: MetadataSettings = {
                       pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
                       defaults : {}
                   }): ModuleWithProviders {
        return {
            ngModule : MetadataModule,
            providers : [
                MetadataService,
                { provide : METADATA_SETTINGS, useValue : metadataSettings }
            ]
        };
    }
}
