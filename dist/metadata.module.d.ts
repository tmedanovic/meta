import { ModuleWithProviders } from '@angular/core';
import { PageTitlePositioning } from './models/page-title-positioning';
export declare function createMetadataSettings(): {
    pageTitlePositioning: PageTitlePositioning;
    defaults: {};
};
export declare class MetadataModule {
    static forRoot(metadataSettings?: any): ModuleWithProviders;
}
