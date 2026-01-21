const base62 = require('base62');
const aplayerIdPrefix = '__a_';

let counter = 0;

const createAPlayerHTML = aplayerConfig => {
    const aplayerConfigJSON = JSON.stringify(aplayerConfig);
    const id = `${aplayerIdPrefix}${base62.encode(counter++)}`;
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
    if (str.includes('(window.aplayersLite||(window.aplayersLite=[])).push')) {
        str = str.replace(/<!-- aplayer: ([\s\S]+?) -->/g, '$1');
    }
    return str;
});