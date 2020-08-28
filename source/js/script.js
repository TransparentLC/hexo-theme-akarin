((document) => {

console.log(
    '%c Project %c hexo-theme-akarin ',
    'color:#fff;background-color:#555;border-radius:3px 0 0 3px',
    'color:#fff;background-color:#07c;border-radius:0 3px 3px 0'
);
console.log(
    '%c Author %c TransparentLC ',
    'color:#fff;background-color:#555;border-radius:3px 0 0 3px',
    'color:#fff;background-color:#e54;border-radius:0 3px 3px 0'
);
console.log(
    '%c Source %c https://github.com/TransparentLC/hexo-theme-akarin ',
    'color:#fff;background-color:#555;border-radius:3px 0 0 3px',
    'color:#fff;background-color:#9c1;border-radius:0 3px 3px 0'
);

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

const top = document.getElementById('akarin-top');
if (!top) return;

const body = document.body;
const documentElement = document.documentElement;

const scroll = () => {
    const bodyScrollTop = body.scrollTop;
    const documentScrollTop = documentElement.scrollTop;
    const topOffset = bodyScrollTop + documentScrollTop;
    const speed = topOffset / 4;
    if (bodyScrollTop != 0) {
        body.scrollTop -= speed;
    } else {
        documentElement.scrollTop -= speed;
    }
    if (topOffset) requestAnimationFrame(scroll);
};

top.onclick = () => requestAnimationFrame(scroll);

if (top.tagName.toLowerCase() === 'button') {
    const showFab = () => top.classList[
        (2 * documentElement.scrollTop < documentElement.clientHeight) ? 'add' : 'remove'
    ]('mdui-fab-hide');
    let timer;
    addEventListener('scroll', () => {
        clearInterval(timer);
        timer = setTimeout(showFab, 200);
    });
    showFab();
}

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
    e.classList.add(
        `mdui-video-${e.tagName.toLowerCase() === 'video' ? 'fluid' : 'container'}`,
        'mdui-img-rounded',
        'mdui-center',
        'mdui-hoverable'
    );
});

// “复制代码”按钮
const copyBtn = document.createElement('button');
copyBtn.innerHTML = '<i class="mdui-icon material-icons">content_copy</i>';
copyBtn.classList.add(
    'mdui-btn',
    'mdui-btn-icon',
    'mdui-btn-dense',
    'mdui-ripple',
    'mdui-m-a-1',
    'akarin-copy-code-btn'
);
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
    const btn = copyBtn.cloneNode(true);
    btn.onclick = () => copyCode(e.querySelector('code'));
    e.insertAdjacentElement('afterbegin', btn);
});

// 在img上添加一些class
Array.from(document.querySelectorAll('article > img')).forEach(e => {
    e.classList.add(
        'mdui-img-fluid',
        'mdui-img-rounded',
        'mdui-center',
        'mdui-hoverable',
        'mdui-m-y-3'
    );
});

})();

})(document)