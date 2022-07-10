const hexoLog = require('hexo-log');
const htmlMinifier = require('html-minifier-terser');

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
        minifyCSS: true,
        minifyJS: true,
        ...hexo.theme.config.minify_html,
    });
    hexo.log.debug(`Minified: \x1b[35m${data.path}\x1b[39m (\x1b[36m${str.length}\x1b[39m -> \x1b[36m${minified.length}\x1b[39m bytes, \x1b[36m${Math.round(minified.length / str.length * 1e4) / 1e2}%\x1b[39m)`);
    return minified;
});