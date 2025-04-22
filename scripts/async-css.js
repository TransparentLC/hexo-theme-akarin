hexo.extend.helper.register(
    'async_css',
    function (args) {
        return ((typeof args === 'string' || args instanceof String) ? [args] : args)
            .map(e => (typeof e === 'string' || e instanceof String) ? ({ href: e }) : e)
            .map(e => e.sync ? this.css(e) : `<link rel="preload" href="${this.url_for(e.href)}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript>${this.css(e)}</noscript>`)
            .join('');
    },
);