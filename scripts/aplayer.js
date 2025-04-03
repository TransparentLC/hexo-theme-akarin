/**
 * @param {UInt8Array} input
 * @returns {Number}
 */
const fnv1a = input => {
    let hash = 0x811C9DC5;
    for (var i = 0; i < input.length; i++) {
        hash ^= input[i];
        hash += (hash << 24) + (hash << 8) + (hash << 7) + (hash << 4) + (hash << 1);
    }
    return hash >>> 0;
};

const textEncoder = new TextEncoder;

const createAPlayerHTML = aplayerConfig => {
    const aplayerConfigJSON = JSON.stringify(aplayerConfig);
    const id = `aplayer-${fnv1a(textEncoder.encode(aplayerConfigJSON)).toString(16).padStart(8, 0)}`;
    let noscriptText = '';
    if (aplayerConfig.audio.title) {
        noscriptText = `<p><em>♪ ${aplayerConfig.audio.title}` + (aplayerConfig.audio.author ? ` - ${aplayerConfig.audio.author}` : '') + '</em></p>';
    }
    return `
        <div id="${id}" class="aplayer" style="margin-bottom:20px"></div>
        <script>(window.aplayersLite||(window.aplayersLite=[])).push(${aplayerConfigJSON.replace(/^{/, `{container:document.getElementById('${id}'),`)})</script>
        <noscript>
            ${noscriptText}<audio src="${aplayerConfig.audio.url}" controls preload="metadata"></audio>
        </noscript>
    `;
};

hexo.extend.tag.register(
    'aplayerlite',
    /**
     * @param {String[]} args
     * @returns {String}
     */
    args => {
        const [title, author, url, cover, lrc] = args;
        const aplayerConfig = {
            audio: {
                title,
                author,
                url,
                cover,
            },
        };
        if (lrc) {
            aplayerConfig.lrcType = 3;
            aplayerConfig.audio.lrc = lrc;
        }
        return createAPlayerHTML(aplayerConfig);
    },
);

hexo.extend.tag.register(
    'aplayerlitelrc',
    /**
     * @param {String[]} args
     * @param {String} content
     * @returns {String}
     */
    (args, content) => {
        const [title, author, url, cover] = args;
        const aplayerConfig = {
            lrcType: 1,
            audio: {
                title,
                author,
                url,
                cover,
                lrc: content,
            },
        };
        return createAPlayerHTML(aplayerConfig);
    },
    {
        ends: true,
    },
);

hexo.extend.filter.register('after_render:html', (str, data) => {
    if (str.includes('<script>(window.aplayersLite||(window.aplayersLite=[])).push')) {
        str = str.replace(/<!-- aplayer: ([\s\S]+?) -->/g, '$1');
    }
    return str;
});