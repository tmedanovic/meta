// angular
import { Title, DOCUMENT } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Injector } from '@angular/core';
import { fakeAsync, getTestBed, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import 'rxjs/add/operator/filter';

// module
import { MetadataModule, MetadataLoader, MetadataStaticLoader, MetadataService, PageTitlePositioning, MetadataSettings } from '..';

let defaultSettings: MetadataSettings = {
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    defaults: {}
};

let emptySettings: MetadataSettings = {
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    defaults: undefined
};

let testSettings: MetadataSettings = {
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'Tour of (lazy/busy) heroes',
    applicationUrl: 'http://localhost:3000',
    defaults: {
        title: 'Mighty mighty mouse',
        description: 'Mighty Mouse is an animated superhero mouse character',
        'author': 'Mighty Mouse',
        'publisher': 'a superhero',
        'og:image': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/superraton.jpg',
        'og:type': 'website',
        'og:locale': 'en_US',
        'og:locale:alternate': 'nl_NL,tr_TR'
    }
};

const testRoutes = [
    {
        path: '',
        children: [
            {
                path: 'duck',
                data: {
                    metadata: {
                        disabled: true,
                        title: 'Rubber duckie',
                        description: 'Have you seen my rubber duckie?'
                    }
                }
            },
            {
                path: 'toothpaste',
                data: {
                    metadata: {
                        title: 'Toothpaste',
                        override: true, // prevents appending/prepending the application name to the title attribute
                        description: 'Eating toothpaste is considered to be too healthy!',
                        'og:locale' : 'fr_FR',
                        'og:locale:alternate' : 'en_US,tr_TR'
                    }
                }
            },
            {
                path: 'no-data'
            },
            {
                path: 'no-metadata',
                data: {
                    dummy: 'yummy'
                }
            }
        ],
        data: {
            metadata: {
                title: 'Sweet home',
                description: 'Home, home sweet home... and what?'
            }
        }
    }
];

// test module configuration for each test
const testModuleConfig = (options?: any) => {
    // reset the test environment before initializing it.
    TestBed.resetTestEnvironment();

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
        .configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(testRoutes),
                MetadataModule.forRoot(options)
            ]
        });
};

function getAttribute(doc: any, name: string, attribute: string): string {
    let selector = `meta[name="${name}"]`;

    if (name.lastIndexOf('og:', 0) === 0)
        selector = `meta[property="${name}"]`;

    const el = doc.querySelector(selector);

    return !!el ? el.getAttribute(attribute) : undefined;
};

describe('ng2-metadata:',
    () => {
        beforeEach(() => {
            function createMetadataLoader(): MetadataStaticLoader {
                return new MetadataStaticLoader(testSettings);
            }

            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });
        });

        describe('MetadataLoader',
            () => {
                it('should be able to return the default metadataSettings',
                    () => {
                        const res = new MetadataStaticLoader().getSettings();

                        expect(res).toEqual(defaultSettings);
                    });

                it('should be able to provide MetadataStaticLoader',
                    () => {
                        function createMetadataLoader(): MetadataStaticLoader {
                            return new MetadataStaticLoader(testSettings);
                        }

                        testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                        const injector = getTestBed();
                        const metadata = injector.get(MetadataService);

                        expect(metadata).toBeDefined();
                        expect(metadata.loader).toBeDefined();
                        expect(metadata.loader instanceof MetadataStaticLoader).toBeTruthy();
                    });

                it('should be able to provide any MetadataLoader',
                    () => {
                        class CustomLoader implements MetadataLoader {
                            getSettings(): MetadataSettings {
                                return emptySettings;
                            }
                        }

                        testModuleConfig({ provide: MetadataLoader, useClass: CustomLoader });

                        const injector = getTestBed();
                        const metadata = injector.get(MetadataService);

                        expect(metadata).toBeDefined();
                        expect(metadata.loader).toBeDefined();
                        expect(metadata.loader instanceof CustomLoader).toBeTruthy();
                    });
            });

        describe('MetadataService',
            () => {
                beforeEach(() => {
                    function createMetadataLoader(): MetadataStaticLoader {
                        return new MetadataStaticLoader(testSettings);
                    }

                    testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });
                });

                it('is defined',
                    inject([MetadataService],
                        (metadata: MetadataService) => {
                            expect(MetadataService).toBeDefined();
                            expect(metadata).toBeDefined();
                            expect(metadata instanceof MetadataService).toBeTruthy();
                        }));

                it('should be able to set metadata using routes',
                    inject([Title, DOCUMENT],
                        fakeAsync((title: Title, doc: any) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(testSettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);
                            const router = injector.get(Router);

                            expect(metadata).toBeDefined();
                            expect(metadata.loader).toBeDefined();
                            expect(metadata.loader instanceof MetadataStaticLoader).toBeTruthy();

                            // initial navigation
                            router.navigate(['/'])
                                .then(() => {
                                    expect(title.getTitle()).toEqual('Sweet home - Tour of (lazy/busy) heroes');
                                    expect(getAttribute(doc, 'description', 'content')).toEqual('Home, home sweet home... and what?');
                                    expect(getAttribute(doc, 'og:url', 'content')).toEqual('http://localhost:3000');

                                    // override applicationName
                                    router.navigate(['/toothpaste'])
                                        .then(() => {
                                            expect(title.getTitle()).toEqual('Toothpaste');
                                            expect(getAttribute(doc, 'description', 'content'))
                                                .toEqual('Eating toothpaste is considered to be too healthy!');
                                            expect(getAttribute(doc, 'og:url', 'content')).toEqual('http://localhost:3000/toothpaste');

                                            // disable metadata
                                            router.navigate(['/duck'])
                                                .then(() => {
                                                    expect(title.getTitle()).toEqual('Sweet home - Tour of (lazy/busy) heroes');
                                                    expect(getAttribute(doc, 'description', 'content'))
                                                        .toEqual('Home, home sweet home... and what?');

                                                    // no-data
                                                    router.navigate(['/no-data'])
                                                        .then(() => {
                                                            expect(title.getTitle()).toEqual('Sweet home - Tour of (lazy/busy) heroes');
                                                            expect(getAttribute(doc, 'description', 'content'))
                                                                .toEqual('Home, home sweet home... and what?');
                                                            expect(getAttribute(doc, 'og:url', 'content'))
                                                                .toEqual('http://localhost:3000/no-data');

                                                            // no-metadata
                                                            router.navigate(['/no-metadata'])
                                                                .then(() => {
                                                                    expect(title.getTitle())
                                                                        .toEqual('Sweet home - Tour of (lazy/busy) heroes');
                                                                    expect(getAttribute(doc, 'description', 'content'))
                                                                        .toEqual('Home, home sweet home... and what?');
                                                                    expect(getAttribute(doc, 'og:url', 'content'))
                                                                        .toEqual('http://localhost:3000/no-metadata');
                                                                });
                                                        });
                                                });
                                        });
                                });
                        })));

                it('should be able to set metadata using routes w/o default settings',
                    inject([Title, DOCUMENT],
                        fakeAsync((title: Title, doc: any) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(emptySettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);
                            const router = injector.get(Router);

                            expect(metadata).toBeDefined();
                            expect(metadata.loader).toBeDefined();
                            expect(metadata.loader instanceof MetadataStaticLoader).toBeTruthy();

                            // initial navigation
                            router.navigate(['/'])
                                .then(() => {
                                    expect(title.getTitle()).toEqual('Sweet home');
                                    expect(getAttribute(doc, 'description', 'content')).toEqual('Home, home sweet home... and what?');
                                    expect(getAttribute(doc, 'og:url', 'content')).toEqual('/');
                                });
                        })));

                it('should be able to set title',
                    inject([MetadataService, Title],
                        (metadata: MetadataService, title: Title) => {
                            // default title
                            metadata.setTitle('');
                            expect(title.getTitle()).toEqual('Mighty mighty mouse - Tour of (lazy/busy) heroes');

                            // given title
                            metadata.setTitle('Mighty tiny mouse');
                            expect(title.getTitle()).toEqual('Mighty tiny mouse - Tour of (lazy/busy) heroes');

                            // override applicationName
                            metadata.setTitle('Mighty tiny mouse', true);
                            expect(title.getTitle()).toEqual('Mighty tiny mouse');
                        }));

                it('should be able to set title (appended)',
                    inject([Title],
                        (title: Title) => {
                            const appendedSettings = testSettings;
                            appendedSettings.pageTitlePositioning = PageTitlePositioning.AppendPageTitle;

                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(appendedSettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);

                            // default title
                            metadata.setTitle('');
                            expect(title.getTitle()).toEqual('Tour of (lazy/busy) heroes - Mighty mighty mouse');

                            // given title
                            metadata.setTitle('Mighty tiny mouse');
                            expect(title.getTitle()).toEqual('Tour of (lazy/busy) heroes - Mighty tiny mouse');

                            // override applicationName
                            metadata.setTitle('Mighty tiny mouse', true);
                            expect(title.getTitle()).toEqual('Mighty tiny mouse');
                        }));

                it('should be able to set title w/o default settings',
                    inject([Title],
                        (title: Title) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader({
                                    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
                                    defaults: {}
                                });
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);

                            metadata.setTitle('');
                            expect(title.getTitle()).toEqual('');
                        }));

                it('should be able to set title w/o default settings (appended)',
                    inject([Title],
                        (title: Title) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader({
                                    pageTitlePositioning: PageTitlePositioning.AppendPageTitle,
                                    defaults: {}
                                });
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);

                            metadata.setTitle('');
                            expect(title.getTitle()).toEqual('');
                        }));

                it('should throw if you pass an invalid PageTitlePositioning',
                    inject([MetadataService],
                        (metadata: MetadataService) => {
                            const invalidSettings = testSettings;
                            invalidSettings.pageTitlePositioning = undefined;

                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(invalidSettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            expect(() => {
                                    metadata.setTitle('');
                                })
                                .toThrowError('Error: Invalid pageTitlePositioning specified [undefined]!');
                        }));

                it('should throw if you attempt to set title through setTag method',
                    inject([MetadataService],
                        (metadata: MetadataService) => {
                            expect(() => {
                                    metadata.setTag('title', '');
                                })
                                .toThrowError(`Error: Attempt to set title through 'setTag': 'title' is a reserved tag name. `
                                    + `Please use 'MetadataService.setTitle' instead.`);
                        }));

                it('should be able to set meta description',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default meta description
                            metadata.setTag('description', '');
                            expect(getAttribute(doc, 'description', 'content'))
                                .toEqual('Mighty Mouse is an animated superhero mouse character');

                            // given meta description
                            metadata.setTag('description', 'Mighty Mouse is a cool character');
                            expect(getAttribute(doc, 'description', 'content')).toEqual('Mighty Mouse is a cool character');
                        }));

                it('should be able to set meta description w/o default settings',
                    inject([DOCUMENT],
                        (doc: any) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(emptySettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);

                            metadata.setTag('description', '');
                            expect(getAttribute(doc, 'description', 'content')).toEqual('');
                        }));

                it('should be able to set meta author',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default meta author
                            metadata.setTag('author', '');
                            expect(getAttribute(doc, 'author', 'content')).toEqual('Mighty Mouse');

                            // given meta author
                            metadata.setTag('author', 'Mickey Mouse');
                            expect(getAttribute(doc, 'author', 'content')).toEqual('Mickey Mouse');
                        }));

                it('should be able to set meta publisher',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default meta publisher
                            metadata.setTag('publisher', '');
                            expect(getAttribute(doc, 'publisher', 'content')).toEqual('a superhero');

                            // given meta publisher
                            metadata.setTag('publisher', 'another superhero');
                            expect(getAttribute(doc, 'publisher', 'content')).toEqual('another superhero');
                        }));

                it('should be able to set og:locale',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default og:locale
                            metadata.setTag('og:locale', '');
                            expect(getAttribute(doc, 'og:locale', 'content')).toEqual('en_US');

                            // given og:locale
                            metadata.setTag('og:locale', 'tr_TR');
                            expect(getAttribute(doc, 'og:locale', 'content')).toEqual('tr_TR');
                        }));

                it('should be able to set og:locale:alternate w/ og:locale',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default og:locale
                            metadata.setTag('og:locale', '');

                            const elements = doc.querySelectorAll('meta[property="og:locale:alternate"]');

                            expect(elements.length).toEqual(2);
                            expect(elements[0].getAttribute('content')).toEqual('nl_NL');
                            expect(elements[1].getAttribute('content')).toEqual('tr_TR');
                        }));

                it('should be able to set og:locale:alternate w/ og:locale:alternate',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default og:locale:alternate
                            metadata.setTag('og:locale:alternate', '');

                            const elements = doc.querySelectorAll('meta[property="og:locale:alternate"]');

                            expect(elements.length).toEqual(2);
                            expect(elements[0].getAttribute('content')).toEqual('nl_NL');
                            expect(elements[1].getAttribute('content')).toEqual('tr_TR');

                            // given og:locale:alternate
                            metadata.setTag('og:locale:alternate', 'tr_TR');
                            expect(getAttribute(doc, 'og:locale:alternate', 'content')).toEqual('tr_TR');
                        }));

                it('should be able to set og:locale w/o default settings',
                    inject([DOCUMENT],
                        (doc: any) => {
                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(emptySettings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);

                            metadata.setTag('og:locale', '');
                            expect(getAttribute(doc, 'og:locale', 'content')).toEqual('');
                        }));

                it('should be able to do not set og:locale:alternate as current og:locale',
                    inject([MetadataService],
                        (metadata: MetadataService) => {
                            const injector = getTestBed();
                            const doc = injector.get(DOCUMENT);

                            metadata.setTag('og:locale:alternate', 'en_US');
                            expect(getAttribute(doc, 'og:locale:alternate', 'content')).toBeUndefined();
                        }));

                it('should be able to do not set og:locale:alternate using routes w/o default settings & w/o og:locale',
                    inject([Title, DOCUMENT],
                        fakeAsync((title: Title, doc: any) => {
                            const settings = defaultSettings;
                            settings.defaults['og:locale:alternate'] = 'en_US';

                            function createMetadataLoader(): MetadataStaticLoader {
                                return new MetadataStaticLoader(settings);
                            }

                            testModuleConfig({ provide: MetadataLoader, useFactory: (createMetadataLoader) });

                            const injector = getTestBed();
                            const metadata = injector.get(MetadataService);
                            const router = injector.get(Router);

                            expect(metadata).toBeDefined();
                            expect(metadata.loader).toBeDefined();
                            expect(metadata.loader instanceof MetadataStaticLoader).toBeTruthy();

                            // initial navigation
                            router.navigate(['/'])
                                .then(() => {
                                    expect(title.getTitle()).toEqual('Sweet home');
                                    expect(getAttribute(doc, 'description', 'content')).toEqual('Home, home sweet home... and what?');
                                    expect(getAttribute(doc, 'og:url', 'content')).toEqual('/');
                                    expect(getAttribute(doc, 'og:locale:alternate', 'content')).toBeUndefined();
                                });
                        })));

                it('should be able to set any other meta tag',
                    inject([MetadataService, DOCUMENT],
                        (metadata: MetadataService, doc: any) => {
                            // default og:type
                            metadata.setTag('og:type', '');
                            expect(getAttribute(doc, 'og:type', 'content')).toEqual('website');

                            // given og:type
                            metadata.setTag('og:type', 'blog');
                            expect(getAttribute(doc, 'og:type', 'content')).toEqual('blog');
                        }));
            });
    });
