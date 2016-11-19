import { PageTitlePositioning } from './page-title-positioning';
export interface MetadataSettings {
    pageTitlePositioning: PageTitlePositioning;
    pageTitleSeparator?: string;
    applicationName?: string;
    applicationUrl?: string;
    defaults?: {
        title?: string;
        description?: string;
        keywords?: string;
        [key: string]: string;
    };
}
