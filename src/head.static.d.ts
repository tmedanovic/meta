export interface IHead {
    metaTags: any[];
    title: string;
    locale: string;
}
export declare class HeadStatic {
    private static _head;
    static readonly Head: IHead;
}
