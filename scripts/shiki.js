const { escapeHTML } = require('hexo-util');
const shiki = require('shiki');
const {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel,
    transformerStyleToClass,
} = require('@shikijs/transformers');
const IndexMap = require('./indexmap.js');

/**
 * @type {{
 *  inject_styles: Boolean,
 *  line_number: Boolean,
 *  transformer: Boolean,
 *  langs?: shiki.BundledLanguage[],
 *  lang_alias?: Record<String, shiki.BundledLanguage>,
 *  theme?: shiki.BundledTheme,
 *  themes?: {
 *      light: shiki.BundledTheme,
 *      dark: shiki.BundledTheme,
 *  },
 * }}
 */
const config = hexo.config.shiki;
const enabled = hexo.config.syntax_highlighter === 'shiki';
const nonce = Math.random().toString(16).substring(2, 10);
const shikiClassNamePrefixUnmerged = `__shiki_${nonce}_`;
const shikiClassNamePrefix = '__s_';

const highlighter = await shiki.createHighlighter({
    themes: (
        config.themes
            ? [config.themes.light, config.themes.dark]
            : (config.theme ? [config.theme] : [])
    ),
    langs: Array.isArray(config.langs) ? config.langs : Object.keys(shiki.bundledLanguages),
    langAlias: config.lang_alias || undefined,
});

const themeConfig = (
    config.themes
        ? { themes: config.themes }
        : (config.theme ? { themes: { light: config.theme }} : {})
);

/** @type {Set<String>} */
const missingLanguages = new Set;

hexo.extend.highlight.register(
    'shiki',
    /**
     * @param {String} code
     * @param {{
     *  lang: String,
     *  caption?: String,
     *  lines_length: Number,
     * }} options
     * @returns {String}
     */
    (code, options) => {
        try {
            const toClass = transformerStyleToClass({ classPrefix: shikiClassNamePrefixUnmerged });
            const highlighted = highlighter.codeToHtml(code, {
                ...themeConfig,
                defaultColor: false,
                lang: options.lang,
                transformers: [
                    ...(config.transformer ? [
                        transformerNotationDiff(),
                        transformerNotationHighlight(),
                        transformerNotationWordHighlight(),
                        transformerNotationFocus(),
                        transformerNotationErrorLevel(),
                    ] : []),
                    toClass,
                ],
            });
            /** @type {Map<String, String>} */
            const classRegistry = new Map;
            for (const [k, v] of toClass.getClassRegistry().entries()) {
                classRegistry.set(k, typeof v === 'string' ? v : Object.entries(v).map(([k, v]) => `${k}:${v}`).join(';'));
            }
            return (
                `<figure>${highlighted}${options.lang ? `<code class="language">${options.lang}</code>` : ''}</figure>`
                + `<!-- ${nonce} shiki class registry: ${btoa(JSON.stringify(Object.fromEntries(classRegistry.entries())))} -->`
            );
        } catch (error) {
            const m = error.message.match(/^Language `(.+?)` not found, you may need to load it first$/);
            if (m) {
                let lang = m[1];
                if (config.lang_alias) {
                    while (config.lang_alias[lang]) lang = config.lang_alias[lang];
                }
                missingLanguages.add(lang);
            } else {
                hexo.log.warn('shiki highlight error:', error.message);
            }
            return `<figure><pre class="shiki"><code>${escapeHTML(code)}</code></pre></figure>`;
        }
    },
);

if (enabled) {
    hexo.extend.filter.register('before_exit', () => {
        if (missingLanguages.size) {
            hexo.log.warn('shiki highlight missing languages:', Array.from(missingLanguages).sort().join(', '));
        }
    });

    // Line numbers · Issue #3 · shikijs/shiki
    // https://github.com/shikijs/shiki/issues/3#issuecomment-830564854
    // Light/Dark Dual Themes | Shiki
    // https://shiki.style/guide/dual-themes
    // @shikijs/transformers | Shiki
    // https://shiki.style/packages/transformers
    hexo.extend.injector.register('head_end', `
        <style>
            ${config.inject_styles ? `
                ${config.line_number ? `
                    pre.shiki code {
                        counter-reset: step;
                        counter-increment: step 0;
                    }

                    pre.shiki code .line::before {
                        content: counter(step);
                        counter-increment: step;
                        width: 1.2rem;
                        margin-right: 1.2rem;
                        display: inline-block;
                        text-align: right;
                        color: rgba(115,138,148,.4)
                    }
                ` : ''}

                ${config.transformer ? `
                    pre.shiki.has-diff code .line.diff,
                    pre.shiki.has-highlighted code .line.highlighted {
                        display: inline-block;
                        width: fit-content;
                        min-width: 100%;
                    }
                    pre.shiki.has-diff code .line.diff.remove {
                        background-color: rgba(244,63,94,.2);
                    }
                    pre.shiki.has-diff code .line.diff.remove:before {
                        content: "-";
                        color: #b34e52;
                    }
                    pre.shiki.has-diff code .line.diff.add {
                        background-color: rgba(16,185,129,.2);
                    }
                    pre.shiki.has-diff code .line.diff.add:before {
                        content: "+";
                        color: #18794e;
                    }
                    pre.shiki.has-highlighted code .line.highlighted {
                        background-color: rgba(142,150,170,.2);
                    }
                    pre.shiki.has-highlighted code .line.highlighted.error {
                        background-color: rgba(244,63,94,.2);
                    }
                    pre.shiki.has-highlighted code .line.highlighted.warning {
                        background-color: rgba(234,179,8,.2);
                    }
                    pre.shiki code .highlighted-word {
                        background-color: rgba(255,255,0,.3);
                        border-radius: 4px;
                        margin: -1px -2px;
                        padding: 1px 2px;
                    }
                    pre.shiki.has-focused code .line {
                        filter: blur(3px);
                        opacity: .7;
                        transition: filter .35s, opacity .35s;
                    }
                    pre.shiki.has-focused:hover code .line,
                    pre.shiki.has-focused code .line.focused {
                        filter: blur(0);
                        opacity: 1;
                    }
                ` : ''}

                figure:has(pre.shiki) {
                    position: relative;
                    margin: 0;
                    text-align: left;
                }

                pre.shiki.shiki-themes {
                    background-color: var(--shiki-light-bg);
                }
                pre.shiki.shiki-themes span {
                    color: var(--shiki-light);
                    font-style: var(--shiki-light-font-style);
                    font-weight: var(--shiki-light-font-weight);
                    text-decoration: var(--shiki-light-text-decoration);
                }

                pre.shiki ~ .copy {
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin: 4px !important;
                    padding: 8px !important;
                    color: #59636e;
                    transition: opacity .2s;
                    opacity: 0;
                }
                pre.shiki:hover ~ .copy, pre.shiki ~ .copy:hover {
                    opacity: 1;
                }
                @media (prefers-color-scheme: dark) {
                    pre.shiki ~ .copy {
                        color: #9198a1;
                    }
                }

                pre.shiki ~ .language {
                    position: absolute;
                    top: 0;
                    right: 0;
                    color: #59636e;
                    text-transform: uppercase;
                    transition: right .2s;
                    opacity: .5;
                    margin: 4px !important;
                    padding: 8px !important;
                    line-height: 1 !important;
                    background: none !important;
                    border: none !important;
                    pointer-events: none;
                }
                @media (prefers-color-scheme: dark) {
                    pre.shiki ~ .language {
                        color: #9198a1;
                    }
                }
                pre.shiki:hover ~ .language, pre.shiki ~ .copy:hover ~ .language {
                    right: 28px;
                }

                ${config.themes ? `
                    @media (prefers-color-scheme: dark) {
                        pre.shiki.shiki-themes {
                            background-color: var(--shiki-dark-bg);
                        }
                        pre.shiki.shiki-themes span {
                            color: var(--shiki-dark);
                            font-style: var(--shiki-dark-font-style);
                            font-weight: var(--shiki-dark-font-weight);
                            text-decoration: var(--shiki-dark-text-decoration);
                        }
                    }
                ` : ''}
            ` : ''}

            /* ${nonce} shiki class registry placeholder */
        </style>
    `, 'post');

    hexo.extend.filter.register('after_render:html', str => {
        if (!str.includes(`/* ${nonce} shiki class registry placeholder */`)) return str;

        /** @type {IndexMap<string, string>} */
        const im = new IndexMap(shikiClassNamePrefix);

        return str
            .replace(
                new RegExp(`<!-- ${nonce} shiki class registry: ([A-Za-z\\d+/]+?=*?) -->`, 'g'),
                (...m) => {
                    for (const [k, v] of Object.entries(JSON.parse(atob(m[1])))) {
                        im.set(k, v);
                    }
                    return '';
                },
            )
            .replaceAll(new RegExp(`${RegExp.escape(shikiClassNamePrefixUnmerged)}[A-Za-z\\d]+`, 'g'), m => im.getIndex(m))
            .replaceAll(
                `/* ${nonce} shiki class registry placeholder */`,
                Array.from(im.valueMapping.entries())
                    .map(([i, v]) => `.${i}{${v}}`)
                    .join(''),
            );
    }, 5);
}
