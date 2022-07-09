const hexoLog = require('hexo-log');
const htmlMinifier = require('html-minifier-terser');

const logger = hexoLog({ debug: false });

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
    logger.debug(`Minified ${data.path} from ${str.length} to ${minified.length} bytes (${Math.round(minified.length / str.length * 1e4) / 1e2}%)`);
    return minified;
});