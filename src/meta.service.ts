// angular
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HeadService } from './head.service';
import { isBrowser, isNode } from 'angular2-universal';

// libs
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs';

// module
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetaLoader } from './meta.loader';
import { isObservable } from './util';

@Injectable()
export class MetaService {
  private setTitleSubject = new Subject<string>();

  private readonly metaSettings: any;
  private readonly isMetaTagSet: any;
  private useRouteData: boolean;

  constructor(public loader: MetaLoader,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly headService: HeadService) {
    this.metaSettings = loader.getSettings();
    this.isMetaTagSet = {};

    if (!this.metaSettings.defer)
      this.init();
  }

  public onSetTitle() : Observable<string> {
    return this.setTitleSubject.asObservable();
  }

  init(useRouteData: boolean = true): void {
    // don't use route data unless allowed
    if (!useRouteData)
      return;

    this.useRouteData = true;

    this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        this.traverseRoutes(this.activatedRoute, routeData.urlAfterRedirects);
      });
  }

  refresh(): void {
    // don't use route data unless allowed
    if (!this.useRouteData)
      return;

    this.traverseRoutes(this.router.routerState.root, this.router.url);
  }

  setTitle(title: string, override = false): void {
    const title$ = this.getTitleWithPositioning(title, override);
    this.updateTitle(title$);
  }

  setTag(tag: string, value: string): void {
    if (tag === 'title')
      throw new Error(`Attempt to set ${tag} through 'setTag': 'title' is a reserved tag name. `
        + `Please use 'MetaService.setTitle' instead.`);

    const value$ = (tag !== 'og:locale' && tag !== 'og:locale:alternate')
      ? this.callback(!!value
        ? value
        : (!!this.metaSettings.defaults && this.metaSettings.defaults[tag])
          ? this.metaSettings.defaults[tag]
          : '')
      : Observable.of(!!value
        ? value
        : (!!this.metaSettings.defaults && this.metaSettings.defaults[tag])
          ? this.metaSettings.defaults[tag]
          : '');

    this.updateMetaTag(tag, value$);
  }

  private createMetaTag(name: string): any {
    let tag = {};

    tag[name.lastIndexOf('og:', 0) === 0 ? 'property' : 'name'] = name;
    this.headService.addMetaTag(tag);

    return tag;
  }

  private getOrCreateMetaTag(name: string): any {
    let tag;

    if (name.lastIndexOf('og:', 0) === 0) {
      tag = this.headService.findFirstMetaTag('property', name);
    } else {
      tag = this.headService.findFirstMetaTag('name', name);
    }

    if (!tag)
      tag = this.createMetaTag(name);

    return tag;
  }

  private callback(value: string): Observable<string> {
    if (!!this.metaSettings.callback) {
      const value$ = this.metaSettings.callback(value);

      if (!isObservable(value$))
        return Observable.of(value$);

      return value$;
    }

    return Observable.of(value);
  }

  private getTitleWithPositioning(title: string, override: boolean): Observable<string> {
    let defaultTitle$;

    if (this.metaSettings.defaults && this.metaSettings.defaults['title']) {
       defaultTitle$ = this.callback(this.metaSettings.defaults['title']);
    } else {
       defaultTitle$ = Observable.of('');
    }
    let title$: Observable<string>;
    if (title) {
      title$ = this.callback(title);
    } else {
      title$ = defaultTitle$;
    }

    switch (this.metaSettings.pageTitlePositioning) {
      case PageTitlePositioning.AppendPageTitle:

        if (!override && this.metaSettings.pageTitleSeparator && this.metaSettings.applicationName) {
           return this.callback(this.metaSettings.applicationName).flatMap((operand1) => {
              return title$.map(res => res + this.metaSettings.pageTitleSeparator + operand1);
           });
        } else {
           return title$;
        }
      case PageTitlePositioning.PrependPageTitle:

        if (!override && this.metaSettings.pageTitleSeparator && this.metaSettings.applicationName) {
           return this.callback(this.metaSettings.applicationName).flatMap((operand1) => {
              return title$.map(res => operand1 + this.metaSettings.pageTitleSeparator + res );
           });
        } else {
           return title$;
        }
      default:
        throw new Error(`Invalid pageTitlePositioning specified [${this.metaSettings.pageTitlePositioning}]!`);
    }
  }

  private updateTitle(title$: Observable<string>): void {
    const ogTitleElement = this.getOrCreateMetaTag('og:title');

    title$.subscribe((res: string) => {
      ogTitleElement['content'] = res;
      this.headService.setTitle(res);

      if (isBrowser) {
        this.setTitleSubject.next(res);
      }
    });
  }

  private updateLocales(currentLocale: string, availableLocales: string): void {
    if (!currentLocale)
      currentLocale = !!this.metaSettings.defaults
        ? this.metaSettings.defaults['og:locale']
        : '';

    if (!!currentLocale && !!this.metaSettings.defaults)
      this.metaSettings.defaults['og:locale'] = currentLocale.replace(/_/g, '-');

    this.headService.setLocale(currentLocale);
    this.headService.removeMetaTags('property', 'og:locale:alternate');

    if (!!currentLocale && !!availableLocales) {
      availableLocales.split(',')
        .forEach((locale: string) => {
          if (currentLocale.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
            const el = this.createMetaTag('og:locale:alternate');
            el['content'] = locale.replace(/-/g, '_');
          }
        });
    }
  }

  private updateMetaTag(tag: string, value$: Observable<string>): void {
    const tagElement = this.getOrCreateMetaTag(tag);

    value$.subscribe((res: string) => {
      tagElement['content'] = tag === 'og:locale' ? res.replace(/-/g, '_') : res;
      this.isMetaTagSet[tag] = true;

      if (tag === 'description') {
        const ogDescriptionElement = this.getOrCreateMetaTag('og:description');
        ogDescriptionElement['content'] = res;
      } else if (tag === 'author') {
        const ogAuthorElement = this.getOrCreateMetaTag('og:author');
        ogAuthorElement['content'] = res;
      } else if (tag === 'publisher') {
        const ogPublisherElement = this.getOrCreateMetaTag('og:publisher');
        ogPublisherElement['content'] = res;
      } else if (tag === 'og:locale') {
        const availableLocales = !!this.metaSettings.defaults
          ? this.metaSettings.defaults['og:locale:alternate']
          : '';

        this.updateLocales(res, availableLocales);
        this.isMetaTagSet['og:locale:alternate'] = true;
      } else if (tag === 'og:locale:alternate') {
        const ogLocaleElement = this.getOrCreateMetaTag('og:locale');

        const currentLocale = ogLocaleElement.getAttribute('content');

        this.updateLocales(currentLocale, res);
        this.isMetaTagSet['og:locale'] = true;
      }
    });
  }

  private updateMetaTags(currentUrl: string, metaSettings?: any): void {
    if (!metaSettings) {
      const fallbackTitle = !!this.metaSettings.defaults
        ? (this.metaSettings.defaults['title'] || this.metaSettings['applicationName'])
        : this.metaSettings['applicationName'];

      this.setTitle(fallbackTitle, true);
    } else {
      if (metaSettings.disabled) {
        this.updateMetaTags(currentUrl);
        return;
      }

      this.setTitle(metaSettings.title, metaSettings.override);

      Object.keys(metaSettings)
        .forEach(key => {
          let value = metaSettings[key];

          if (key === 'title' || key === 'override')
            return;
          else if (key === 'og:locale')
            value = value.replace(/-/g, '_');
          else if (key === 'og:locale:alternate') {
            const currentLocale = metaSettings['og:locale'];
            this.updateLocales(currentLocale, metaSettings[key]);

            return;
          }

          this.setTag(key, value);
        });
    }

    if (!!this.metaSettings.defaults)
      Object.keys(this.metaSettings.defaults)
        .forEach(key => {
          let value = this.metaSettings.defaults[key];

          if ((!!metaSettings && (key in this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override')
            return;
          else if (key === 'og:locale')
            value = value.replace(/-/g, '_');
          else if (key === 'og:locale:alternate') {
            const currentLocale = !!metaSettings ? metaSettings['og:locale'] : undefined;
            this.updateLocales(currentLocale, this.metaSettings.defaults[key]);

            return;
          }

          this.setTag(key, value);
        });

    const url = ((this.metaSettings.applicationUrl || '/') + currentUrl)
      .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      .replace(/\/$/g, '');

    this.setTag('og:url', url || '/');
  }

  private traverseRoutes(route: ActivatedRoute, url: string): void {
    while (route.children.length > 0) {
      route = route.firstChild;

      if (!!route.snapshot.routeConfig.data) {
        const metaSettings = route.snapshot.routeConfig.data['meta'];
        this.updateMetaTags(url, metaSettings);
      }
      else
        this.updateMetaTags(url);
    }
  }
}
