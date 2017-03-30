import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadService } from './head.service';
import 'rxjs';
import { MetaLoader } from './meta.loader';
export declare class MetaService {
    loader: MetaLoader;
    private readonly router;
    private readonly activatedRoute;
    private readonly headService;
    private readonly titleService;
    private readonly metaSettings;
    private readonly isMetaTagSet;
    private useRouteData;
    constructor(loader: MetaLoader, router: Router, activatedRoute: ActivatedRoute, headService: HeadService, titleService: Title);
    init(useRouteData?: boolean): void;
    refresh(): void;
    setTitle(title: string, override?: boolean): void;
    setTag(tag: string, value: string): void;
    private createMetaTag(name);
    private getOrCreateMetaTag(name);
    private callback(value);
    private getTitleWithPositioning(title, override);
    private updateTitle(title$);
    private updateLocales(currentLocale, availableLocales);
    private updateMetaTag(tag, value$);
    private updateMetaTags(currentUrl, metaSettings?);
    private traverseRoutes(route, url);
}
