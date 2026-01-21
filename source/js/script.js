(document => {

/**
 * @param {String} label
 * @param {String} message
 * @param {String} color
 */
const consoleBadge = (label, message, color) => console.log(
    `%c ${label} %c ${message} `,
    'color:#fff;background-color:#555;border-radius:3px 0 0 3px',
    `color:#fff;background-color:${color};border-radius:0 3px 3px 0`,
);

consoleBadge('Project', 'hexo-theme-akarin', '#07c');
consoleBadge('Author', 'TransparentLC', '#f84');
consoleBadge('Source', 'https://github.com/TransparentLC/hexo-theme-akarin', '#4b1');

// ****************
// 懒加载组件
// ****************

class LazyLoad {
    /** @type {Number | undefined} */
    static imageSupport = undefined;
    /** @type {{type: String, img: String, mask: Number}[]} */
    static imageSupportTest = Object.freeze([
        // 26 bytes
        // https://github.com/mathiasbynens/small/blob/master/webp.webp
        Object.freeze({
            type: 'webp',
            img: 'data:image/webp;base64,UklGRhIAAABXRUJQVlA4TAYAAAAvQWxvAGs',
            mask: 1 << 0,
        }),
        // 298 bytes
        // https://github.com/mathiasbynens/small/issues/115#issuecomment-827240563
        Object.freeze({
            type: 'avif',
            img: 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOltZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAAQ0AAAAVAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGhpcHJwAAAASWlwY28AAAAUaXNwZQAAAAAAAAABAAAAAQAAAA5waXhpAAAAAAEIAAAADGF2MUOBABwAAAAAE2NvbHJuY2x4AAEADQAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAHW1kYXQSAAoHGAAOWAhoNTIIH/AAAQACH0A',
            mask: 1 << 1,
        }),
        // 12 bytes
        // https://shkspr.mobi/blog/2024/01/whats-the-smallest-file-size-for-a-1-pixel-image/#comment-363591
        Object.freeze({
            type: 'jxl',
            img: 'data:image/jxl;base64,/wr/BwiDBAwASyAY',
            mask: 1 << 2,
        }),
    ]);
    defaults = Object.freeze({
        root: null,
        rootMargin: '0px',
        threshold: 0,
        loadingSrc: null,
        beforeObserve: () => {},
        afterObserve: () => {},
    });

    /**
     * @param {HTMLElement[]} image
     * @param {{
     *  root: HTMLElement,
     *  rootMargin: String,
     *  threshold: Number | Number[],
     *  loadingSrc: String,
     *  beforeObserve: (e: HTMLElement) => void,
     *  afterObserve: (e: HTMLElement) => void,
     * }} config
     */
    constructor(image, config) {
        if (this.constructor.imageSupport === undefined) {
            Promise.all(
                this.constructor.imageSupportTest.map(e => new Promise(resolve => {
                    const testImg = new Image;
                    testImg.onload = testImg.onerror = () => resolve(testImg.width && e.mask);
                    testImg.src = e.img;
                }))
            ).then(result => {
                result.forEach(e => this.constructor.imageSupport |= e);
                consoleBadge(
                    'Next-Gen Image',
                    this.constructor.imageSupportTest
                        .map(e => this.constructor.imageSupport & e.mask ? e.type : '')
                        .filter(e => e)
                        .join() || 'None',
                    '#f6b'
                );
            });
        }

        this.config = {...this.defaults, ...config};
        this.observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && this.load(entry.target)), this.config);
        image.forEach((/** @type {HTMLElement} */ el) => {
            (
                this.config.loadingSrc ? this.setSrc(el, this.config.loadingSrc) : Promise.resolve()
            ).then(() => {
                this.config.beforeObserve(el);
                this.observer.observe(el);
            });
        });
    }
    /**
     * @param {HTMLElement} el
     * @param {String} src
     * @returns {Promise}
     */
    setSrc(el, src) {
        return new Promise(resolve => {
            const preloadImg = new Image;
            preloadImg.onload = preloadImg.onerror = () => {
                if (el.tagName.toLowerCase() === 'img') {
                    el.src = src;
                } else {
                    el.style.backgroundImage = `url(${src})`;
                }
                resolve();
            }
            preloadImg.src = src;
        });
    }
    /**
     * @param {HTMLElement} el
     */
    load(el) {
        let src = '';
        this.constructor.imageSupportTest.forEach(e => {
            const dataSrc = el.getAttribute(`data-src-${e.type}`);
            if (dataSrc && (this.constructor.imageSupport & e.mask)) src = dataSrc;
        });
        this.setSrc(el, src || el.getAttribute('data-src')).then(() => {
            this.observer.unobserve(el);
            this.config.afterObserve(el);
        });
    }
    destroy() {
        this.observer.disconnect();
        this.config = null;
    }
}

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

// 点击主页的封面图也能打开文章，并且添加预加载
Array.from(document.querySelectorAll('[data-entry]')).forEach(e => {
    const el = e.parentElement.previousElementSibling;
    el.onclick = () => location.href = e.href;
    if (window.preload) el.addEventListener('mouseover', () => !_preloadedList.has(e.href) && setTimeout(() => preload(e.href), 8 * _delayOnHover));
});

// ****************
// 对文章进行处理
// ****************
(() => {

const copyBtn = document.createElement('button');
copyBtn.innerHTML = '<span class="mdui-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"/></svg></span>';
copyBtn.classList.add(
    'mdui-btn',
    'mdui-btn-icon',
    'mdui-btn-dense',
    'mdui-ripple',
    'copy',
);
const copyCode = (/** @type {PointerEvent} */ e) => navigator.clipboard.writeText(e.currentTarget.previousSibling.innerText);

const beforeObserve = el => (el.tagName.toLowerCase() === 'img') && mediumZoom(el, {
    margin: 16,
    scrollOffset: 8,
    background: 'rgba(0,0,0,.85)',
});
const afterObserve = el => {
    const blurred = (el.nextElementSibling && el.nextElementSibling.classList.contains('akarin-blurred'))
        ? el.nextElementSibling
        : el.querySelector('.akarin-blurred');
    if (blurred) {
        setTimeout(() => blurred.classList.add('akarin-blurred-fade-out'), 50);
        setTimeout(() => blurred.style.visibility = 'hidden', 1050);
    }
};

new LazyLoad(Array.from(document.querySelectorAll('.akarin-util-bg-cover[data-src]')), {
    beforeObserve,
    afterObserve,
});

/**
 * @param {HTMLElement} container
 */
const enhance = container => {
    // 为图片添加懒加载
    new LazyLoad(Array.from(container.querySelectorAll('[data-src]')), {
        beforeObserve,
        afterObserve,
    });

    // 在视频上添加class
    Array.from(container.querySelectorAll('video,.video-container')).forEach(e => {
        e.classList.add(
            `mdui-video-${e.tagName.toLowerCase() === 'video' ? 'fluid' : 'container'}`,
            'mdui-img-rounded',
            'mdui-center',
            'mdui-hoverable'
        );
    });

    // “复制代码”按钮
    Array.from(article.querySelectorAll('pre.shiki')).forEach(e => {
        /** @type {HTMLButtonElement} */
        const copyBtnCloned = copyBtn.cloneNode(true);
        copyBtnCloned.onclick = copyCode;
        e.after(copyBtnCloned);
    });

    // 在img上添加一些class
    Array.from(container.children).filter(e => e.tagName === 'IMG').forEach(e => {
        e.classList.add(
            'mdui-img-fluid',
            'mdui-img-rounded',
            'mdui-center',
            'mdui-hoverable',
            'mdui-m-y-3'
        );
    });
};

const article = document.querySelector('article');
if (article) enhance(article);

const te = new TextEncoder;
const td = new TextDecoder;

/**
 * @param {PointerEvent} e
 */
const encryptHandler = async e => {
    const container = e.currentTarget.parentNode.parentNode;
    const passwordInput = container.querySelector('input[type=password]');
    const password = passwordInput.value.trim();
    if (!password) return;
    /** @type {Uint8Array} */
    const saltiv = (Uint8Array.frombase64 || (e => Uint8Array.from(atob(e), e => e.charCodeAt())))(container.getAttribute('data-saltiv'));
    const salt = saltiv.subarray(0, 16);
    const iv = saltiv.subarray(16, 16 + 12);
    /** @type {Uint8Array} */
    const encrypted = (Uint8Array.frombase64 || (e => Uint8Array.from(atob(e), e => e.charCodeAt())))(container.getAttribute('data-encrypted'));

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt,
            iterations: 600000,
        },
        await crypto.subtle.importKey('raw', te.encode(password), 'PBKDF2', false, ['deriveKey']),
        { name: 'AES-GCM', length: 128 },
        false,
        ['decrypt'],
    );
    try {
        const decrypted = td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted));
        container.innerHTML = decrypted;
        enhance(container);
        Array.from(container.children).forEach(e => container.before(e));
        container.parentNode.removeChild(container);
    } catch {
        passwordInput.value = '';
        alert('密码错误');
    }
};

Array.from(document.querySelectorAll('[data-encrypted]')).forEach(el => {
    el.querySelector('button').onclick = encryptHandler;
    el.querySelector('input[type=password]').addEventListener('keypress', e => e.keyCode === 13 && encryptHandler(e));
});

})();

})(document)