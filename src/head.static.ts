export interface IHead {
    metaTags: any[];
    title: string;
    locale: string;
}

export class HeadStatic {
    private static _head: IHead = {
        metaTags: [],
        title: '',
        locale: ''
    };

    public static get Head(): IHead {
        return this._head;
    }
}
