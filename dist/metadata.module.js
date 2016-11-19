import { NgModule } from '@angular/core';
import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS } from './models/metadata-settings';
import { MetadataService } from './metadata.service';
export function createMetadataSettings() {
    return {
        pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
        defaults: {}
    };
}
export var MetadataModule = (function () {
    function MetadataModule() {
    }
    MetadataModule.forRoot = function (metadataSettings) {
        if (metadataSettings === void 0) { metadataSettings = {
            provide: METADATA_SETTINGS,
            useFactory: (createMetadataSettings)
        }; }
        return {
            ngModule: MetadataModule,
            providers: [
                metadataSettings,
                MetadataService,
            ]
        };
    };
    MetadataModule.decorators = [
        { type: NgModule },
    ];
    MetadataModule.ctorParameters = [];
    return MetadataModule;
}());
