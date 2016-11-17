import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { MetadataSettings } from './models/metadata-settings';
export declare class MetadataService {
    private router;
    private document;
    private titleService;
    private activatedRoute;
    private metadataSettings;
    private isSet;
    constructor(router: Router, document: any, titleService: Title, activatedRoute: ActivatedRoute, metadataSettings: MetadataSettings);
    setTitle(title: string, override?: boolean): void;
    setTag(tag: string, value: string): void;
    private createMetaTag(name);
    private getOrCreateMetaTag(name);
    private deleteMetaTags(name);
    private updateLocales(currentLocale, availableLocales);
    private updateMetadata(metadata, currentUrl);
}
