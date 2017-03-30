import { Inject, Injectable } from '@angular/core';

export interface IHead {
    metaTags: any[];
    title: string;
    locale: string;
}

@Injectable()
export class HeadService {
    private _head: IHead = {
        metaTags: [],
        title: '',
        locale: ''
    };

    public get Head(): IHead {
        return this._head;
    }

    public setMetaTag(propertyKey: string, propertyValue: string, metaTag: any): void {
       let tagIndex = this._head.metaTags.findIndex((obj => obj[propertyKey] === propertyValue));

       if (tagIndex > -1) {
          this._head.metaTags[tagIndex] = metaTag;
       } else {
          this.addMetaTag(metaTag);
       }
    }

    public findFirstMetaTag(propertyKey: string, propertyValue: string): any {
       let tagIndex = this._head.metaTags.findIndex((obj => obj[propertyKey] === propertyValue));

       if (tagIndex > -1) {
         return this._head.metaTags[tagIndex];
       } else {
          return null;
       }
    }

    public findAllMetaTags(propertyKey: string, propertyValue: string): any[] {
        let tags = this._head.metaTags.filter((obj => obj[propertyKey] === propertyValue));
        return tags;
    }

    public removeMetaTags(propertyKey: string, propertyValue: string): void {
        this._head.metaTags = this._head.metaTags.filter((obj => obj[propertyKey] !== propertyValue));
    }

    public addMetaTag(metaTag: any): void {
        this._head.metaTags.push(metaTag);
    }

    public getMetaTags(): any[] {
        return this._head.metaTags;
    }

    public setTitle(title: string): void {
        this._head.title = title;
    }

    public setLocale(locale: string): void {
        this._head.locale = locale;
    }
}
