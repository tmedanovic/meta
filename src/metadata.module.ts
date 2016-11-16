import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS } from './models/metadata-settings';
import { MetadataService } from './metadata.service';

@NgModule()
export class MetadataModule {
    static forRoot(metadataSettings: any = {
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
