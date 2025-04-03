const url_for = hexo.extend.helper.get('url_for').bind(hexo);
const css = hexo.extend.helper.get('css').bind(hexo);

hexo.extend.helper.register(
    'async_css',
    args => ((typeof args === 'string' || args instanceof String) ? [args] : args)
        .map(e => (typeof e === 'string' || e instanceof String) ? ({ href: e }) : e)
        .map(e => e.sync ? css(e) : `<link rel="preload" href="${url_for(e.href)}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript>${css(e)}</noscript>`)
        .join('')
);
