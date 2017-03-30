import { Inject, Injectable } from '@angular/core';
import { HeadStatic } from './head.static';

@Injectable()
export class HeadService {
    public setMetaTag(propertyKey: string, propertyValue: string, metaTag: any): void {
       let tagIndex = HeadStatic.Head.metaTags.findIndex((obj => obj[propertyKey] === propertyValue));

       if (tagIndex > -1) {
          HeadStatic.Head.metaTags[tagIndex] = metaTag;
       } else {
          this.addMetaTag(metaTag);
       }
    }

    public findFirstMetaTag(propertyKey: string, propertyValue: string): any {
       let tagIndex = HeadStatic.Head.metaTags.findIndex((obj => obj[propertyKey] === propertyValue));

       if (tagIndex > -1) {
         return HeadStatic.Head.metaTags[tagIndex];
       } else {
          return null;
       }
    }

    public findAllMetaTags(propertyKey: string, propertyValue: string): any[] {
        let tags = HeadStatic.Head.metaTags.filter((obj => obj[propertyKey] === propertyValue));
        return tags;
    }

    public removeMetaTags(propertyKey: string, propertyValue: string): void {
        HeadStatic.Head.metaTags = HeadStatic.Head.metaTags.filter((obj => obj[propertyKey] !== propertyValue));
    }

    public addMetaTag(metaTag: any): void {
        HeadStatic.Head.metaTags.push(metaTag);
    }

    public getMetaTags(): any[] {
        return HeadStatic.Head.metaTags;
    }

    public setTitle(title: string): void {
        HeadStatic.Head.title = title;
    }

    public setLocale(locale: string): void {
        HeadStatic.Head.locale = locale;
    }
}
