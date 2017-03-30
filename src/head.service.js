import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var HeadService = (function () {
    function HeadService() {
        this._head = {
            metaTags: [],
            title: '',
            locale: ''
        };
    }
    Object.defineProperty(HeadService.prototype, "Head", {
        get: function () {
            return this._head;
        },
        enumerable: true,
        configurable: true
    });
    HeadService.prototype.setMetaTag = function (propertyKey, propertyValue, metaTag) {
        var tagIndex = this._head.metaTags.findIndex((function (obj) { return obj[propertyKey] === propertyValue; }));
        if (tagIndex > -1) {
            this._head.metaTags[tagIndex] = metaTag;
        }
        else {
            this.addMetaTag(metaTag);
        }
    };
    HeadService.prototype.findFirstMetaTag = function (propertyKey, propertyValue) {
        var tagIndex = this._head.metaTags.findIndex((function (obj) { return obj[propertyKey] === propertyValue; }));
        if (tagIndex > -1) {
            return this._head.metaTags[tagIndex];
        }
        else {
            return null;
        }
    };
    HeadService.prototype.findAllMetaTags = function (propertyKey, propertyValue) {
        var tags = this._head.metaTags.filter((function (obj) { return obj[propertyKey] === propertyValue; }));
        return tags;
    };
    HeadService.prototype.removeMetaTags = function (propertyKey, propertyValue) {
        this._head.metaTags = this._head.metaTags.filter((function (obj) { return obj[propertyKey] !== propertyValue; }));
    };
    HeadService.prototype.addMetaTag = function (metaTag) {
        this._head.metaTags.push(metaTag);
    };
    HeadService.prototype.getMetaTags = function () {
        return this._head.metaTags;
    };
    HeadService.prototype.setTitle = function (title) {
        this._head.title = title;
    };
    HeadService.prototype.setLocale = function (locale) {
        this._head.locale = locale;
    };
    return HeadService;
}());
HeadService = tslib_1.__decorate([
    Injectable()
], HeadService);
export { HeadService };
