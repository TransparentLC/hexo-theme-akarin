require('mathjax').init({
    loader: {
        load: ['input/tex', 'output/svg'],
    },
}).then(e => globalThis.MathJax = e);

// https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
// 即使是服务端渲染，katex仍然需要在网页上加载字体，而mathjax支持将公式直接渲染成svg，所以这里选用mathjax

const inlineStartRule = /(?<=\s|^)\${1,2}(?!\$)/;
const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])+?)(?<!\$)\1(?=\s|$)/;
const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;
const renderer = token => {
    const rendered = MathJax.startup.adaptor.outerHTML(MathJax.tex2svg(token.text, {
        display: token.displayMode,
    }));
    // 不加\u200b的话，html-minifier会将<mjx-container>当成块级元素，删掉公式前后的空格
    return token.displayMode ? rendered : `\u200b${rendered}\u200b`;
};

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