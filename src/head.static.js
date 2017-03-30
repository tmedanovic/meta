var HeadStatic = (function () {
    function HeadStatic() {
    }
    Object.defineProperty(HeadStatic, "Head", {
        get: function () {
            return this._head;
        },
        enumerable: true,
        configurable: true
    });
    return HeadStatic;
}());
export { HeadStatic };
HeadStatic._head = {
    metaTags: [],
    title: '',
    locale: ''
};
