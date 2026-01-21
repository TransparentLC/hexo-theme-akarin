const mdi = require('@mdi/js');
const IndexMap = require('./indexmap.js');

const nonce = Math.random().toString(16).substring(2, 10);
const svgIconIdPrefix = '__i_';

/** @type {Record<String, (value: String) => String>} */
const processors = {
    mdi: value => `<!-- ${nonce} svg icon: ${btoa(mdi[`mdi${value.split('-').map(e => e[0].toUpperCase() + e.substring(1)).join('')}`])} -->`,
    path: value => `<!-- ${nonce} svg icon: ${btoa(value)} -->`,
};

hexo.extend.helper.register(
    'svg_icon',
    /**
     * @param {String} svg
     * @returns {String}
     */
    svg => {
        for (const [prefix, processor] of Object.entries(processors)) {
            if (svg.startsWith(`${prefix}:`)) return processor(svg.substring(`${prefix}:`.length));
        }
        return svg;
    },
);

hexo.extend.injector.register('body_begin', `<!-- ${nonce} svg icon defs -->`);

hexo.extend.filter.register('after_render:html', str => {
    /** @type {IndexMap<string, void>} */
    const im = new IndexMap(svgIconIdPrefix);

    return str
        .replace(new RegExp(`<!-- ${nonce} svg icon: ([A-Za-z\\d+/]+?=*?) -->`, 'g'), (...m) => {
            const path = atob(m[1]);
            im.set(path);
            return `<svg viewBox="0 0 24 24"><use xlink:href="#${im.getIndex(path)}"/></svg>`;
        })
        .replaceAll(
            `<!-- ${nonce} svg icon defs -->`,
            im.indexMapping.size
                ? `<svg class="mdui-hidden">${
                    Array.from(im.indexMapping.entries())
                        .map(([k, i]) => `<path id="${i}" d="${k}"/>`)
                        .join('')
                }</svg>`
                : '',
        );
});

hexo.extend.injector.register('head_end', `
    <style>
        .mdui-icon {
            fill: currentColor;
            width: 24px;
            display: inline-block;
        }
    </style>
`);
