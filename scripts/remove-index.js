hexo.extend.helper.register(
    'removeIndex',
    str => str.endsWith('/index.html') ? str.replace(/\/index\.html$/, '/') : str,
);