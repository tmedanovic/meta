import { NgModule } from '@angular/core';
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetadataLoader, MetadataStaticLoader } from './metadata.service';
import { MetadataService } from './metadata.service';
export function metadataLoaderFactory() {
    return new MetadataStaticLoader({
        pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
        defaults: {}
    });
}
export var MetadataModule = (function () {
    function MetadataModule() {
    }
    MetadataModule.forRoot = function (providedLoader) {
        if (providedLoader === void 0) { providedLoader = {
            provide: MetadataLoader,
            useFactory: (metadataLoaderFactory)
        }; }
        return {
            ngModule: MetadataModule,
            providers: [
                providedLoader,
                MetadataService
            ]
        };
    };
    MetadataModule.decorators = [
        { type: NgModule },
    ];
    MetadataModule.ctorParameters = [];
    return MetadataModule;
}());
