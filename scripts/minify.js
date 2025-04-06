const htmlMinifier = require('html-minifier-terser');
const lightningcss = require('lightningcss');
const swc = require('@swc/core');

const encoder = new TextEncoder;
const decoder = new TextDecoder;

hexo.extend.filter.register('after_render:html', async (str, data) => {
    if (!hexo.theme.config.minify_html.enable) return str;
    const minified = await htmlMinifier.minify(str, {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        decodeEntities: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeEmptyAttributes: true,
        useShortDoctype: true,
        sortAttributes: true,
        sortClassName: true,
        processConditionalComments: true,
        processScripts: [
            'application/ld+json',
        ],
        /**
         * @param {String} text
         * @param {'inline' | 'media' | undefined} type
         * @returns {String}
         */
        minifyCSS: (text, type) => {
            // function wrapCSS(text, type)
            // https://github.com/terser/html-minifier-terser/blob/c4a7ae0bd08b1a438d9ca12a229b4cbe93fc016a/src/htmlminifier.js#L355
            switch (type) {
                case 'inline':
                    text = `*{${text}}`;
                    break;
                case 'media':
                    text = `@media ${text}{a{top:0}}`;
                    break;
            }
            const minified = decoder.decode(lightningcss.transform({ code: encoder.encode(text), minify: true }).code);
            // function unwrapCSS(text, type)
            // https://github.com/terser/html-minifier-terser/blob/c4a7ae0bd08b1a438d9ca12a229b4cbe93fc016a/src/htmlminifier.js#L366
            /** @type {RegExpMatchArray | null} */
            let m;
            switch (type) {
                case 'inline':
                    m = minified.match(/^\*\{([\s\S]*)\}$/);
                    return m ? m[1] : minified;
                case 'media':
                    m = minified.match(/^@media ([\s\S]*?)\s*{[\s\S]*}$/);
                    return m ? m[1] : minified;
                default:
                    return minified;
            }
        },
        /**
         * @param {String} text
         * @param {Boolean} inline
         * @returns {String}
         */
        minifyJS: async (text, inline) => await swc.minify(text, {
            compress: {
                // https://github.com/swc-project/swc/blob/main/crates/swc_ecma_minifier/src/option/terser.rs
                // impl From<TerserEcmaVersion> for EsVersion
                ecma: 2022,
                arguments: true,
                unsafe_arrows: true,
                unsafe_math: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_symbols: true,
                unsafe_undefined: true,
            },
            mangle: true,
            format: {
                comments: false,
            },
            sourceMap: false,
        }).then(r => r.code),
        ...hexo.theme.config.minify_html,
    });
    hexo.log.debug(`Minified: \x1b[35m${data.path}\x1b[39m (\x1b[36m${str.length}\x1b[39m -> \x1b[36m${minified.length}\x1b[39m bytes, \x1b[36m${Math.round(minified.length / str.length * 1e4) / 1e2}%\x1b[39m)`);
    return minified;
});