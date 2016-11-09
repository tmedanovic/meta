import { Inject, Injectable } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { PageTitlePositioning } from './models/page-title-positioning';
import { METADATA_SETTINGS, MetadataSettings } from './models/metadata-settings';


@Injectable()
export class MetadataService {
    constructor(private router: Router,
                @Inject(DOCUMENT) private document: any,
                private titleService: Title,
                private activatedRoute: ActivatedRoute,
                @Inject(METADATA_SETTINGS) private metadataSettings: MetadataSettings) {

        this.router.events
            .filter(event => (event instanceof NavigationEnd))
            .subscribe((routeData: any) => {
                let route = this.activatedRoute;

                while (route.children.length > 0) {
                    route = route.firstChild;

                    if (route.snapshot.routeConfig.data) {
                        const metadata = route.snapshot.routeConfig.data['metadata'];

                        if (!!metadata) {
                            this.updateMetadata(metadata, routeData.url);
                        }
                    }
                }
            });
    }

    private getOrCreateMetaTag(name: string) {
        let selector = `meta[name='${name}']`;

        if (name.lastIndexOf('og:', 0) === 0)
            selector = `meta[property='${name}']`;

        let el = this.document.querySelector(selector);

        if (!el) {
            el = this.document.createElement('meta');
            el.setAttribute(name.lastIndexOf('og:', 0) === 0 ? 'property' : 'name', name);
            this.document.head.appendChild(el);
        }

        return el;
    }

    private updateMetadata(metadata: any = {}, currentUrl: string) {
        if (metadata.disabled) {
            return false;
        }

        this.setTitle(metadata.title, metadata.override);

        Object.keys(metadata)
            .forEach(key => {
                if (key === 'title' || key === 'override') {
                    return;
                }

                this.setTag(key, metadata[key]);
            });

        Object.keys(this.metadataSettings.defaults)
            .forEach(key => {
                if (key in metadata || key === 'title' || key === 'override') {
                    return;
                }

                this.setTag(key, this.metadataSettings.defaults[key]);
            });

        this.setTag('og:url', this.metadataSettings.applicationUrl + currentUrl);

        return true;
    }

    setTitle(title: string, override = false): MetadataService {
        const ogTitleElement = this.getOrCreateMetaTag('og:title');

        switch (this.metadataSettings.pageTitlePositioning) {
            case PageTitlePositioning.AppendPageTitle:
                title = (!override ? (this.metadataSettings.applicationName + this.metadataSettings.pageTitleSeparator) : '')
                            + (!!title ? title : this.metadataSettings.defaults['title']);
                break;
            case PageTitlePositioning.PrependPageTitle:
                title = (!!title ? title : this.metadataSettings.defaults['title'])
                            + (!override ? (this.metadataSettings.pageTitleSeparator + this.metadataSettings.applicationName) : '');
                break;
        }

        ogTitleElement.setAttribute('content', title);
        this.titleService.setTitle(title);

        return this;
    }

    setTag(tag: string, value: string): MetadataService {
        if (tag === 'title') {
            throw new Error(`Attempt to set ${tag} through 'setTag': 'title' is a reserved tag name. `
                + `Please use 'MetadataService.setTitle' instead`);
        }

        value = !!value ? value : (this.metadataSettings.defaults[tag] || '');

        if (!value)
            return this;

        const tagElement = this.getOrCreateMetaTag(tag);
        tagElement.setAttribute('content', value);
        
        if (tag === 'description') {
            const ogDescriptionElement = this.getOrCreateMetaTag('og:description');
            ogDescriptionElement.setAttribute('content', value);
        }

        if (tag === 'author') {
            const ogAuthorElement = this.getOrCreateMetaTag('og:author');
            ogAuthorElement.setAttribute('content', value);
        }

        if (tag === 'publisher') {
            const ogPublisherElement = this.getOrCreateMetaTag('og:publisher');
            ogPublisherElement.setAttribute('content', value);
        }

        return this;
    }
}
