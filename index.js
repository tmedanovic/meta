import * as tslib_1 from "tslib";
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MetaLoader, MetaStaticLoader } from './src/meta.loader';
import { MetaService } from './src/meta.service';
export * from './src/models/page-title-positioning';
export * from './src/meta.loader';
export * from './src/meta.service';
export function metaFactory() {
    return new MetaStaticLoader();
}
var MetaModule = MetaModule_1 = (function () {
    function MetaModule(parentModule) {
        if (parentModule)
            throw new Error('MetaModule already loaded; import in root module only.');
    }
    MetaModule.forRoot = function (configuredProvider) {
        if (configuredProvider === void 0) { configuredProvider = {
            provide: MetaLoader,
            useFactory: (metaFactory)
        }; }
        return {
            ngModule: MetaModule_1,
            providers: [
                configuredProvider,
                MetaService
            ]
        };
    };
    return MetaModule;
}());
MetaModule = MetaModule_1 = tslib_1.__decorate([
    NgModule(),
    tslib_1.__param(0, Optional()),
    tslib_1.__param(0, SkipSelf()),
    tslib_1.__metadata("design:paramtypes", [MetaModule])
], MetaModule);
export { MetaModule };
var MetaModule_1;
