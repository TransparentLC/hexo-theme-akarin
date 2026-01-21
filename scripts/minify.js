const htmlnano = require('htmlnano');
const { isStyleNode, extractCssFromStyleNode, extractTextContentFromNode, isEventHandler } = require('htmlnano/helpers');
const lightningcss = require('lightningcss');
const swc = require('@swc/core');

const encoder = new TextEncoder;
const decoder = new TextDecoder;

hexo.extend.filter.register('after_render:html', async (str, data) => {
    if (!hexo.theme.config.minify_html.enable) return str;

    const minified = await htmlnano.process(str, {
        ...htmlnano.presets.safe,
        removeRedundantAttributes: true,
        sortAttributes: true,
        removeComments: 'all',
        mergeStyles: true,
        mergeScripts: true,
        minifyCss: false,
        minifyJs: false,
        minifySvg: {
            plugins: [
                {
                    name: 'preset-default',
                    params: {
                        overrides: {
                            cleanupIds: false,
                        },
                    },
                },
                {
                    name: 'removeAttrs',
                    params: { attrs: ['g:data-mml-node', 'use:data-mml-node', 'use:data-c', 'data-mjx-texclass'] },
                },
                'collapseGroups',
                'removeXlink',
                'removeXMLNS',
            ],
        },
        custom: [
            // Minify CSS
            tree => {
                const minify = css => decoder.decode(lightningcss.transform({ filename: '', code: encoder.encode(css), minify: true }).code);

                tree.walk(node => {
                    if (isStyleNode(node) && !node?.attrs?.integrity) {
                        node.content = [minify(extractCssFromStyleNode(node))];
                    } else if (node?.attrs?.style) {
                        node.attrs.style = minify(`*{${node.attrs.style}}`).match(/\*\{(.*)\}/)[1];
                    }
                    return node;
                });
                return tree;
            },
            // Minify JS
            tree => {
                const minify = js => swc.minifySync(js, {
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
                }).code;

                tree.walk(node => {
                    if (node.tag === 'script' && !node?.attrs?.integrity && (!node?.attrs?.type || node?.attrs?.type === 'text/javascript' || node?.attrs?.type === 'module')) {
                        node.content = [minify(extractTextContentFromNode(node))];
                    }
                    if (node.attrs) {
                        for (const attr in node?.attrs) {
                            if (!isEventHandler(attr) || typeof node.attrs[attr] !== 'string') continue;
                            try {
                                node.attrs[attr] = minify(node.attrs[attr].trim().replace(/^javascript:/, ''));
                            } catch (error) {
                                hexo.log.warn('Failed to minify JS in attribute:', error.message);
                            }
                        }
                    }
                    return node;
                });
                return tree;
            },
            // Minify <script type="application/ld+json">
            tree => {
                tree.walk(node => {
                    if (node.tag === 'script' && node?.attrs?.type === 'application/ld+json') {
                        node.content = [JSON.stringify(JSON.parse(extractTextContentFromNode(node)))];
                    }
                    return node;
                });
                return tree;
            },
        ],
        ...(() => {
            const { enable, ...config } = hexo.theme.config.minify_html;
            return config;
        })(),
    }).then(r => r.html);

    hexo.log.debug(`Minified: \x1b[35m${data.path}\x1b[39m (\x1b[36m${str.length}\x1b[39m -> \x1b[36m${minified.length}\x1b[39m bytes, \x1b[36m${Math.round(minified.length / str.length * 1e4) / 1e2}%\x1b[39m)`);
    return minified;
}, 20);