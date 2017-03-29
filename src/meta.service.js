import * as tslib_1 from "tslib";
import { DOCUMENT, Title } from '@angular/platform-browser';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { __platform_browser_private__ } from '@angular/platform-browser';
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
    function MetaService(loader, router, document, title, activatedRoute) {
        this.loader = loader;
        this.router = router;
        this.document = document;
        this.title = title;
        this.activatedRoute = activatedRoute;
        this._dom = __platform_browser_private__.getDOM();
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
    MetaService.prototype.setTitle = function (title, override, deferred) {
        var _this = this;
        if (override === void 0) { override = false; }
        if (deferred === void 0) { deferred = true; }
        var title$ = this.getTitleWithPositioning(title, override);
        if (!deferred)
            this.updateTitle(title$);
        else {
            var sub_1 = this.router.events
                .filter(function (event) { return (event instanceof NavigationEnd); })
                .subscribe(function () {
                _this.updateTitle(title$);
            });
            setTimeout(function () {
                sub_1.unsubscribe();
            }, 1);
        }
    };
    MetaService.prototype.setTag = function (tag, value, deferred) {
        var _this = this;
        if (deferred === void 0) { deferred = true; }
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
        if (!deferred)
            this.updateMetaTag(tag, value$);
        else {
            var sub_2 = this.router.events
                .filter(function (event) { return (event instanceof NavigationEnd); })
                .subscribe(function () {
                _this.updateMetaTag(tag, value$);
            });
            setTimeout(function () {
                sub_2.unsubscribe();
            }, 1);
        }
    };
    MetaService.prototype.createMetaTag = function (name) {
        var el = this._dom.createElement('meta');
        this._dom.setAttribute(el, name.lastIndexOf('og:', 0) === 0 ? 'property' : 'name', name);
        var head = this.document.head;
        this._dom.appendChild(head, el);
        return el;
    };
    MetaService.prototype.getOrCreateMetaTag = function (name) {
        var selector = "meta[name=\"" + name + "\"]";
        var head = this.document.head;
        if (name.lastIndexOf('og:', 0) === 0)
            selector = "meta[property=\"" + name + "\"]";
        var el = this._dom.querySelector(head, selector);
        if (!el)
            el = this.createMetaTag(name);
        return el;
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
            _this._dom.setAttribute(ogTitleElement, 'content', res);
            _this.title.setTitle(res);
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
        var html = this._dom.childNodes['html'];
        this._dom.setAttribute(html, 'lang', currentLocale);
        var head = this.document.head;
        var selector = "meta[property=\"og:locale:alternate\"]";
        var elements = this._dom.querySelectorAll(head, selector);
        elements = Array.prototype.slice.call(elements);
        elements.forEach(function (el) {
            _this._dom.removeChild(head, el);
        });
        if (!!currentLocale && !!availableLocales) {
            availableLocales.split(',')
                .forEach(function (locale) {
                if (currentLocale.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
                    var el = _this.createMetaTag('og:locale:alternate');
                    _this._dom.setAttribute(el, 'content', locale.replace(/-/g, '_'));
                }
            });
        }
    };
    MetaService.prototype.updateMetaTag = function (tag, value$) {
        var _this = this;
        var tagElement = this.getOrCreateMetaTag(tag);
        value$.subscribe(function (res) {
            _this._dom.setAttribute(tagElement, 'content', tag === 'og:locale' ? res.replace(/-/g, '_') : res);
            _this.isMetaTagSet[tag] = true;
            if (tag === 'description') {
                var ogDescriptionElement = _this.getOrCreateMetaTag('og:description');
                _this._dom.setAttribute(ogDescriptionElement, 'content', res);
            }
            else if (tag === 'author') {
                var ogAuthorElement = _this.getOrCreateMetaTag('og:author');
                _this._dom.setAttribute(ogAuthorElement, 'content', res);
            }
            else if (tag === 'publisher') {
                var ogPublisherElement = _this.getOrCreateMetaTag('og:publisher');
                _this._dom.setAttribute(ogPublisherElement, 'content', res);
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
                var currentLocale = _this._dom.getAttribute(ogLocaleElement, 'content');
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
            this.setTitle(fallbackTitle, true, false);
        }
        else {
            if (metaSettings.disabled) {
                this.updateMetaTags(currentUrl);
                return;
            }
            this.setTitle(metaSettings.title, metaSettings.override, false);
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
                _this.setTag(key, value, false);
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
                _this.setTag(key, value, false);
            });
        var url = ((this.metaSettings.applicationUrl || '/') + currentUrl)
            .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
            .replace(/\/$/g, '');
        this.setTag('og:url', url || '/', false);
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
    tslib_1.__param(2, Inject(DOCUMENT)),
    tslib_1.__metadata("design:paramtypes", [MetaLoader,
        Router, Object, Title,
        ActivatedRoute])
], MetaService);
export { MetaService };
