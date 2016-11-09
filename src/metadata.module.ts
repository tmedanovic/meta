import { NgModule, ModuleWithProviders } from '@angular/core';
import { MetadataService } from './metadata.service';
import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';

@NgModule()
export class MetadataModule {
    static forRoot(metadataSettings: MetadataSettings = { defaults : {} }): ModuleWithProviders {
        return {
            ngModule : MetadataModule,
            providers : [
                MetadataService,
                { provide : METADATA_SETTINGS, useValue : metadataSettings }
            ]
        };
    }
}
