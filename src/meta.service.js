import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HeadService } from './head.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/take';
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetaLoader } from './meta.loader';
import { isObservable } from './util';
var MetaService = (function () {
    function MetaService(loader, router, activatedRoute, headService) {
        this.loader = loader;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.headService = headService;
        this.metaSettings = loader.getSettings();
        this.isMetaTagSet = {};
        if (!this.metaSettings.defer)
            this.init();
    }
    MetaService.prototype.init = function (useRouteData) {
        var _this = this;
        if (useRouteData === void 0) { useRouteData = true; }
        if (!useRouteData)
            return;
        this.useRouteData = true;
        this.router.events
            .filter(function (event) { return (event instanceof NavigationEnd); })
            .subscribe(function (routeData) {
            _this.traverseRoutes(_this.activatedRoute, routeData.urlAfterRedirects);
        });
    };
    MetaService.prototype.refresh = function () {
        if (!this.useRouteData)
            return;
        this.traverseRoutes(this.router.routerState.root, this.router.url);
    };
    MetaService.prototype.setTitle = function (title, override) {
        if (override === void 0) { override = false; }
        var title$ = this.getTitleWithPositioning(title, override);
        this.updateTitle(title$);
    };
    MetaService.prototype.setTag = function (tag, value) {
        if (tag === 'title')
            throw new Error("Attempt to set " + tag + " through 'setTag': 'title' is a reserved tag name. "
                + "Please use 'MetaService.setTitle' instead.");
        var value$ = (tag !== 'og:locale' && tag !== 'og:locale:alternate')
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
    };
    MetaService.prototype.createMetaTag = function (name) {
        var tag = {};
        tag[name.lastIndexOf('og:', 0) === 0 ? 'property' : 'name'] = name;
        this.headService.addMetaTag(tag);
        return tag;
    };
    MetaService.prototype.getOrCreateMetaTag = function (name) {
        var tag;
        if (name.lastIndexOf('og:', 0) === 0) {
            tag = this.headService.findFirstMetaTag('property', name);
        }
        else {
            tag = this.headService.findFirstMetaTag('name', name);
        }
        if (!tag)
            tag = this.createMetaTag(name);
        return tag;
    };
    MetaService.prototype.callback = function (value) {
        if (!!this.metaSettings.callback) {
            var value$ = this.metaSettings.callback(value);
            if (!isObservable(value$))
                return Observable.of(value$);
            return value$;
        }
        return Observable.of(value);
    };
    MetaService.prototype.getTitleWithPositioning = function (title, override) {
        var _this = this;
        var defaultTitle$ = (!!this.metaSettings.defaults && !!this.metaSettings.defaults['title'])
            ? this.callback(this.metaSettings.defaults['title'])
            : Observable.of('');
        var title$ = !!title
            ? this.callback(title).concat(defaultTitle$).filter(function (res) { return !!res; }).take(1)
            : defaultTitle$;
        switch (this.metaSettings.pageTitlePositioning) {
            case PageTitlePositioning.AppendPageTitle:
                return ((!override
                    && !!this.metaSettings.pageTitleSeparator
                    && !!this.metaSettings.applicationName)
                    ? this.callback(this.metaSettings.applicationName)
                        .map(function (res) { return res + _this.metaSettings.pageTitleSeparator; })
                    : Observable.of(''))
                    .concat(title$)
                    .reduce(function (acc, cur) { return acc + cur; });
            case PageTitlePositioning.PrependPageTitle:
                return title$
                    .concat((!override
                    && !!this.metaSettings.pageTitleSeparator
                    && !!this.metaSettings.applicationName)
                    ? this.callback(this.metaSettings.applicationName)
                        .map(function (res) { return _this.metaSettings.pageTitleSeparator + res; })
                    : Observable.of(''))
                    .reduce(function (acc, cur) { return acc + cur; });
            default:
                throw new Error("Invalid pageTitlePositioning specified [" + this.metaSettings.pageTitlePositioning + "]!");
        }
    };
    MetaService.prototype.updateTitle = function (title$) {
        var _this = this;
        var ogTitleElement = this.getOrCreateMetaTag('og:title');
        title$.subscribe(function (res) {
            ogTitleElement['content'] = res;
            _this.headService.setTitle(res);
        });
    };
    MetaService.prototype.updateLocales = function (currentLocale, availableLocales) {
        var _this = this;
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
                .forEach(function (locale) {
                if (currentLocale.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
                    var el = _this.createMetaTag('og:locale:alternate');
                    el['content'] = locale.replace(/-/g, '_');
                }
            });
        }
    };
    MetaService.prototype.updateMetaTag = function (tag, value$) {
        var _this = this;
        var tagElement = this.getOrCreateMetaTag(tag);
        value$.subscribe(function (res) {
            tagElement['content'] = tag === 'og:locale' ? res.replace(/-/g, '_') : res;
            _this.isMetaTagSet[tag] = true;
            if (tag === 'description') {
                var ogDescriptionElement = _this.getOrCreateMetaTag('og:description');
                ogDescriptionElement['content'] = res;
            }
            else if (tag === 'author') {
                var ogAuthorElement = _this.getOrCreateMetaTag('og:author');
                ogAuthorElement['content'] = res;
            }
            else if (tag === 'publisher') {
                var ogPublisherElement = _this.getOrCreateMetaTag('og:publisher');
                ogPublisherElement['content'] = res;
            }
            else if (tag === 'og:locale') {
                var availableLocales = !!_this.metaSettings.defaults
                    ? _this.metaSettings.defaults['og:locale:alternate']
                    : '';
                _this.updateLocales(res, availableLocales);
                _this.isMetaTagSet['og:locale:alternate'] = true;
            }
            else if (tag === 'og:locale:alternate') {
                var ogLocaleElement = _this.getOrCreateMetaTag('og:locale');
                var currentLocale = ogLocaleElement.getAttribute('content');
                _this.updateLocales(currentLocale, res);
                _this.isMetaTagSet['og:locale'] = true;
            }
        });
    };
    MetaService.prototype.updateMetaTags = function (currentUrl, metaSettings) {
        var _this = this;
        if (!metaSettings) {
            var fallbackTitle = !!this.metaSettings.defaults
                ? (this.metaSettings.defaults['title'] || this.metaSettings['applicationName'])
                : this.metaSettings['applicationName'];
            this.setTitle(fallbackTitle, true);
        }
        else {
            if (metaSettings.disabled) {
                this.updateMetaTags(currentUrl);
                return;
            }
            this.setTitle(metaSettings.title, metaSettings.override);
            Object.keys(metaSettings)
                .forEach(function (key) {
                var value = metaSettings[key];
                if (key === 'title' || key === 'override')
                    return;
                else if (key === 'og:locale')
                    value = value.replace(/-/g, '_');
                else if (key === 'og:locale:alternate') {
                    var currentLocale = metaSettings['og:locale'];
                    _this.updateLocales(currentLocale, metaSettings[key]);
                    return;
                }
                _this.setTag(key, value);
            });
        }
        if (!!this.metaSettings.defaults)
            Object.keys(this.metaSettings.defaults)
                .forEach(function (key) {
                var value = _this.metaSettings.defaults[key];
                if ((!!metaSettings && (key in _this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override')
                    return;
                else if (key === 'og:locale')
                    value = value.replace(/-/g, '_');
                else if (key === 'og:locale:alternate') {
                    var currentLocale = !!metaSettings ? metaSettings['og:locale'] : undefined;
                    _this.updateLocales(currentLocale, _this.metaSettings.defaults[key]);
                    return;
                }
                _this.setTag(key, value);
            });
        var url = ((this.metaSettings.applicationUrl || '/') + currentUrl)
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/\/$/g, '');
        this.setTag('og:url', url || '/');
    };
    MetaService.prototype.traverseRoutes = function (route, url) {
        while (route.children.length > 0) {
            route = route.firstChild;
            if (!!route.snapshot.routeConfig.data) {
                var metaSettings = route.snapshot.routeConfig.data['meta'];
                this.updateMetaTags(url, metaSettings);
            }
            else
                this.updateMetaTags(url);
        }
    };
    return MetaService;
}());
MetaService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [MetaLoader,
        Router,
        ActivatedRoute,
        HeadService])
], MetaService);
export { MetaService };
