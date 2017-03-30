// angular
import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

// module
import { MetaLoader, MetaStaticLoader } from './src/meta.loader';
import { MetaService } from './src/meta.service';

export * from './src/models/page-title-positioning';
export * from './src/models/meta-settings';
export * from './src/meta.loader';
export * from './src/meta.service';
export * from './src/head.service';
export * from './src/head.static';

// for AoT compilation
export function metaFactory(): MetaLoader {
  return new MetaStaticLoader();
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule()
export class MetaModule {
  static forRoot(configuredProvider: any = {
                   provide: MetaLoader,
                   useFactory: (metaFactory)
                 }): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [
        configuredProvider,
        MetaService
      ]
    };
  }

  constructor(@Optional()
              @SkipSelf() parentModule: MetaModule) {
    if (parentModule)
      throw new Error('MetaModule already loaded; import in root module only.');
  }
}
