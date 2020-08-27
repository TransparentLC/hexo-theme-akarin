((document) => {

// ****************
// 懒加载组件
// ****************
(() => {

/**
 * @typedef {Object} LazyLoadConfig
 * @property {Element} [root]
 * @property {String} [rootMargin]
 * @property {Number|Number[]} [threshold]
 * @property {String} [loadingSrc]
 * @property {function (Element)} [beforeObserve]
 * @property {function (Element)} [afterObserve]
 */

class LazyLoad {
    /**
     * @param {HTMLElement[]} image
     * @param {LazyLoadConfig} config
     */
    constructor(image, config) {
        /** @type {IntersectionObserver} */
        this.observer = null;
        this.image = image;
        this.config = Object.assign({}, this.defaults, config);
        this.imageSupport = 0;
        this.init();
    }
    async init() {
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.load(entry.target);
            });
        }, this.config);
        this.image.forEach((/** @type {Element} */ el) => {
            this.setSrc(el, this.config.loadingSrc);
            this.config.beforeObserve(el);
            this.observer.observe(el);
        });
        (await Promise.all(
            this.imageSupportTest.map(e => new Promise(resolve => {
                const img = new Image;
                img.onload = img.onerror = () => resolve((img.width > 0) ? e.mask : 0);
                img.src = e.img;
            }))
        )).forEach(e => this.imageSupport |= e);
    }
    /**
     * @param {Element} el
     * @param {String} src
     */
    setSrc(el, src) {
        if (el.tagName.toLowerCase() === 'img') {
            el.src = src;
        } else {
            el.style.backgroundImage = `url(${src})`;
        }
    }
    /**
     * @param {Element} el
     */
    load(el) {
        let src = '';
        this.imageSupportTest.forEach(e => {
            const dataSrc = el.getAttribute(`data-src-${e.type}`);
            if (dataSrc && (this.imageSupport & e.mask)) src = dataSrc;
        });
        this.setSrc(el, src || el.getAttribute('data-src'));
        this.observer.unobserve(el);
        this.config.afterObserve(el);
    }
    destroy() {
        this.observer.disconnect();
        this.config = null;
    }
}

Object.assign(LazyLoad.prototype, {
    imageSupportTest: Object.freeze([
        Object.freeze({
            type: 'webp',
            img: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==',
            mask: 1 << 0,
        }),
        Object.freeze({
            type: 'avif',
            img: 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAPJtZXRhAAAAAAAAAChoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAbGliYXZpZgAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAEWAAAAFAAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBTQgAAAAAE2NvbHJuY2x4AAIAAgACgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAHG1kYXQSAAoFWAAOxIAyCRAAAAAP+I9ngg==',
            mask: 1 << 1,
        }),
    ]),
    defaults: Object.freeze({
        root: null,
        rootMargin: '0px',
        threshold: 0,
        loadingSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
        beforeObserve: () => {},
        afterObserve: () => {},
    }),
})

new LazyLoad(Array.from(document.querySelectorAll('[data-src]')));

})();

// ****************
// 返回顶部
// ****************
(() => {

const scroll = () => {
    const bodyScrollTop = document.body.scrollTop;
    const documentScrollTop = document.documentElement.scrollTop;
    const top = bodyScrollTop + documentScrollTop;
    const speed = top / 4;
    console.log(top);
    if (bodyScrollTop != 0) {
        document.body.scrollTop -= speed;
    } else {
        document.documentElement.scrollTop -= speed;
    }
    if (top) requestAnimationFrame(scroll);
};

document.getElementById('akarin-top').onclick = () => requestAnimationFrame(scroll);

})();

// ****************
// 深色模式
// ****************
(() => {

const darkSwitch = document.getElementById('akarin-dark-mode');
darkSwitch.onclick = () => document.body.classList.toggle('mdui-theme-layout-dark');

})();

})(document)