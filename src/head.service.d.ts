export interface IHead {
    metaTags: any[];
    title: string;
    locale: string;
}
export declare class HeadService {
    private _head;
    readonly Head: IHead;
    setMetaTag(propertyKey: string, propertyValue: string, metaTag: any): void;
    findFirstMetaTag(propertyKey: string, propertyValue: string): any;
    findAllMetaTags(propertyKey: string, propertyValue: string): any[];
    removeMetaTags(propertyKey: string, propertyValue: string): void;
    addMetaTag(metaTag: any): void;
    getMetaTags(): any[];
    setTitle(title: string): void;
    setLocale(locale: string): void;
}
