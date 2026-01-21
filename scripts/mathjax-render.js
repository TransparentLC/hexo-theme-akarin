require('mathjax').init({
    loader: {
        load: ['input/tex', 'output/svg'],
    },
}).then(e => globalThis.MathJax = e);
const IndexMap = require('./indexmap.js');

const nonce = Math.random().toString(16).substring(2, 10);
const mathjaxDefsIdPrefix = '__m_';

// https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
// 即使是服务端渲染，katex仍然需要在网页上加载字体，而mathjax支持将公式直接渲染成svg，所以这里选用mathjax

const inlineStartRule = /(?<=\s|^)\${1,2}(?!\$)/;
const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])+?)(?<!\$)\1(?=\s|$)/;
const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;
const renderer = token => `<!-- ${nonce} mathjax render: ${
    btoa(
        MathJax.startup.adaptor.outerHTML(
            MathJax.tex2svg(token.text, { display: token.displayMode })
        )
    )
} -->`;

hexo.extend.injector.register('head_end', `
    <style>
        .MathJax[jax=SVG][display=true] {
            display: block;
            text-align: center;
            margin: 1em 0;
        }
    </style>
`, 'post');

hexo.extend.filter.register('marked:extensions', function (extensions) {
    extensions.push({
        name: 'inlineMath',
        level: 'inline',
        start(src) {
            const match = src.match(inlineStartRule);
            if (!match) {
                return;
            }

            if (src.substring(match.index).match(inlineRule)) {
                return match.index;
            }
        },
        tokenizer(src) {
            const match = src.match(inlineRule);
            if (match) {
                return {
                    type: 'inlineMath',
                    raw: match[0],
                    text: match[2].trim(),
                    displayMode: match[1].length === 2,
                };
            }
        },
        renderer,
    });
    extensions.push({
        name: 'blockMath',
        level: 'block',
        start(src) {
            return src.indexOf('\n$');
        },
        tokenizer(src) {
            const match = src.match(blockRule);
            if (match) {
                return {
                    type: 'blockMath',
                    raw: match[0],
                    text: match[2].trim(),
                    displayMode: match[1].length === 2,
                };
            }
        },
        renderer,
    });
});

hexo.extend.injector.register('body_begin', `<!-- ${nonce} mathjax defs -->`);

hexo.extend.filter.register('after_render:html', str => {
    /** @type {IndexMap<string, string>} */
    const im = new IndexMap(mathjaxDefsIdPrefix);

    return str
        .replace(
            new RegExp(`<!-- ${nonce} mathjax render: ([A-Za-z\\d+/]+?=*?) -->`, 'g'),
            (...m) => atob(m[1])
                .replace(/<path id="MJX-\d+-(.+?-[\dA-F]+)" d="(.+?)"><\/path>/g, (...m) => {
                    im.set(m[1], m[2]);
                    return '';
                })
                .replace(/xlink:href="#MJX-\d+-(.+?-[\dA-F]+)"/g, (...m) => `xlink:href="#${im.getIndex(m[1])}"`)
        )
        .replaceAll(
            `<!-- ${nonce} mathjax defs -->`,
            im.valueMapping.size
                ? `<svg class="mdui-hidden"><defs>${
                    Array.from(im.valueMapping.entries())
                        .map(([i, v]) => `<path id="${i}" d="${v}"/>`)
                        .join('')
                }</defs></svg>`
                : '',
        );
});
