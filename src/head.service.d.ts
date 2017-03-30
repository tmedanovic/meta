export declare class HeadService {
    setMetaTag(propertyKey: string, propertyValue: string, metaTag: any): void;
    findFirstMetaTag(propertyKey: string, propertyValue: string): any;
    findAllMetaTags(propertyKey: string, propertyValue: string): any[];
    removeMetaTags(propertyKey: string, propertyValue: string): void;
    addMetaTag(metaTag: any): void;
    getMetaTags(): any[];
    setTitle(title: string): void;
    setLocale(locale: string): void;
}
