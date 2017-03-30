import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HeadStatic } from './head.static';
var HeadService = (function () {
    function HeadService() {
    }
    HeadService.prototype.setMetaTag = function (propertyKey, propertyValue, metaTag) {
        var tagIndex = HeadStatic.Head.metaTags.findIndex((function (obj) { return obj[propertyKey] === propertyValue; }));
        if (tagIndex > -1) {
            HeadStatic.Head.metaTags[tagIndex] = metaTag;
        }
        else {
            this.addMetaTag(metaTag);
        }
    };
    HeadService.prototype.findFirstMetaTag = function (propertyKey, propertyValue) {
        var tagIndex = HeadStatic.Head.metaTags.findIndex((function (obj) { return obj[propertyKey] === propertyValue; }));
        if (tagIndex > -1) {
            return HeadStatic.Head.metaTags[tagIndex];
        }
        else {
            return null;
        }
    };
    HeadService.prototype.findAllMetaTags = function (propertyKey, propertyValue) {
        var tags = HeadStatic.Head.metaTags.filter((function (obj) { return obj[propertyKey] === propertyValue; }));
        return tags;
    };
    HeadService.prototype.removeMetaTags = function (propertyKey, propertyValue) {
        HeadStatic.Head.metaTags = HeadStatic.Head.metaTags.filter((function (obj) { return obj[propertyKey] !== propertyValue; }));
    };
    HeadService.prototype.addMetaTag = function (metaTag) {
        HeadStatic.Head.metaTags.push(metaTag);
    };
    HeadService.prototype.getMetaTags = function () {
        return HeadStatic.Head.metaTags;
    };
    HeadService.prototype.setTitle = function (title) {
        HeadStatic.Head.title = title;
    };
    HeadService.prototype.setLocale = function (locale) {
        HeadStatic.Head.locale = locale;
    };
    return HeadService;
}());
HeadService = tslib_1.__decorate([
    Injectable()
], HeadService);
export { HeadService };
