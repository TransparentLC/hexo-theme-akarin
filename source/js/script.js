((document) => {

// ****************
// 懒加载组件
// ****************
(() => {

/**
 * @typedef {Object} LazyLoadConfig
 * @property {HTMLElement} [root]
 * @property {String} [rootMargin]
 * @property {Number|Number[]} [threshold]
 * @property {String} [loadingSrc]
 * @property {function(HTMLElement)} [beforeObserve]
 * @property {function(HTMLElement)} [afterObserve]
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
            if (this.config.loadingSrc) this.setSrc(el, this.config.loadingSrc);
            this.config.beforeObserve(el);
            this.observer.observe(el);
        });
        (await Promise.all(
            this.imageSupportTest.map(e => new Promise(resolve => {
                const testImg = new Image;
                testImg.onload = testImg.onerror = () => resolve((testImg.width > 0) ? e.mask : 0);
                testImg.src = e.img;
            }))
        )).forEach(e => this.imageSupport |= e);
    }
    /**
     * @param {HTMLElement} el
     * @param {String} src
     */
    setSrc(el, src) {
        const preloadImg = new Image;
        preloadImg.onload = preloadImg.onerror = () => {
            if (el.tagName.toLowerCase() === 'img') {
                el.src = src;
            } else {
                el.style.backgroundImage = `url(${src})`;
            }
        }
        preloadImg.src = src;
    }
    /**
     * @param {HTMLElement} el
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
        loadingSrc: null,
        beforeObserve: () => {},
        afterObserve: () => {},
    }),
})

new LazyLoad(Array.from(document.querySelectorAll('[data-src]')), {
    beforeObserve: el => (el.tagName.toLowerCase() === 'img') ? mediumZoom(el, {
        margin: 16,
        scrollOffset: 8,
        background: 'rgba(0,0,0,.85)',
    }) : null,
});

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

const dark = Array.from(document.querySelectorAll('[data-dark]'));
dark.forEach((e, i) => {
    e.addEventListener('click', () => {
        dark.forEach((t, j) => t.classList[(i === j) ? 'add' : 'remove']('mdui-list-item-active'));
        switchDark(e.getAttribute('data-dark'));
    });
});
const currentMode = localStorage.getItem('dark');
const currentDark = dark.find(e => e.getAttribute('data-dark') === currentMode);
if (currentDark) currentDark.classList.add('mdui-list-item-active');

})();

// ****************
// 对文章进行处理
// ****************
(() => {

const article = document.querySelector('article');
if (!article) return;

// 在视频上添加class
Array.from(article.querySelectorAll('video,.video-container')).forEach(e => {
    e.classList.add(`mdui-video-${e.tagName.toLowerCase() === 'video' ? 'fluid' : 'container'}`);
    e.classList.add('mdui-img-rounded');
    e.classList.add('mdui-center');
    e.classList.add('mdui-hoverable');
});

// “复制代码”按钮
const copyButton = document.createElement('button');
copyButton.innerHTML = '<i class="mdui-icon material-icons">content_copy</i>';
copyButton.classList.add('mdui-btn');
copyButton.classList.add('mdui-btn-icon');
copyButton.classList.add('mdui-btn-dense');
copyButton.classList.add('mdui-ripple');
copyButton.classList.add('mdui-float-right');
const copyCode = code => {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('Copy');
    selection.removeAllRanges();
    mdui.snackbar('代码已复制', { timeout: 2000 });
};
Array.from(article.querySelectorAll('pre[class^="language-"],pre[class*=" language-"]')).forEach(e => {
    const btn = copyButton.cloneNode(true);
    btn.onclick = () => copyCode(e.querySelector('code'));
    e.insertAdjacentElement('afterbegin', btn);
});

})();

})(document)