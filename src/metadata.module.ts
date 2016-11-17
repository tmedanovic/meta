import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';
import { MetadataService } from './metadata.service';

@NgModule()
export class MetadataModule {
    static forRoot(metadataSettings?: MetadataSettings): ModuleWithProviders {
        if (!metadataSettings) {
            metadataSettings = {
                pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
                defaults : {}
            };
        }

        if (!metadataSettings.pageTitlePositioning) {
            metadataSettings.pageTitlePositioning = PageTitlePositioning.PrependPageTitle;
        }

        if (!metadataSettings.defaults) {
            metadataSettings.defaults = {};
        }

        return {
            ngModule : MetadataModule,
            providers : [
                MetadataService,
                { provide : METADATA_SETTINGS, useValue : metadataSettings }
            ]
        };
    }
}
