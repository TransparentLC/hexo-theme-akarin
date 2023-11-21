hexo.extend.filter.register('marked:renderer', renderer => {
    renderer.image = (href, title, text) => `
        <img
            data-src="${href}"
            class="mdui-img-fluid mdui-img-rounded mdui-center mdui-hoverable"
            alt="${text}"
            title="${title ? title : (text ? text : '')}"
        >
        <noscript>
            <img
                src="${href}"
                class="mdui-img-fluid mdui-img-rounded mdui-center mdui-hoverable"
                alt="${text}"
                title="${title ? title : (text ? text : '')}"
            >
        </noscript>

    `;
    renderer.table = (header, body) => `
        <div class="mdui-table-fluid mdui-shadow-0">
            <table class="mdui-table mdui-table-hoverable">
                <thead>${header}</thead>
                <tbody>${body}</tbody>
            </table>
        </div>
    `;
});