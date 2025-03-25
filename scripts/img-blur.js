const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Sharp v0.32.3 raises "heif: Invalid input" error while reading AVIF.

/** @type {Record<String, [Number, Number, String]>} */
const thumbnailCache = {};
const thumbnailCachePath = path.join(hexo.theme_dir, 'thumbnail-cache.json');

hexo.log.debug(`Thumbnail cache path: \x1b[35m${thumbnailCachePath}\x1b[39m`);

hexo.extend.filter.register('after_init', () => {
    if (!fs.existsSync(thumbnailCachePath)) return;
    Object.assign(thumbnailCache, JSON.parse(fs.readFileSync(thumbnailCachePath, { encoding: 'utf-8' })));
});

hexo.extend.filter.register('before_exit', () => {
    fs.writeFileSync(thumbnailCachePath, JSON.stringify(thumbnailCache));
});

/**
 * @param {String} source
 * @param {Number} size
 * @returns {Promise<{
 *  thumbnailBase64: String,
 *  width: Number,
 *  height: Number,
 * }>}
 */
const createThumbnail = async (source, size = 32) => {
    const cacheKey = `${source}:${size}`;
    if (cacheKey in thumbnailCache) {
        const [thumbnailBase64, width, height] = thumbnailCache[cacheKey];
        hexo.log.debug(`Thumbnail loaded from cache: \x1b[35m${cacheKey}\x1b[39m (\x1b[36m${thumbnailBase64.length}\x1b[39m bytes)`);
        return {
            thumbnailBase64,
            width,
            height,
        };
    }

    let input;
    if (source.match(/^https?:\/\//)) {
        input = Buffer.from(await fetch(source).then(r => {
            if (r.status >= 400) throw new Error(`${r.status} ${r.statusText}`);
            return r.arrayBuffer();
        }));
    } else if (hexo.config.post_asset_folder) {
        input = path.join(this.asset_dir, source);
    } else {
        input = path.join(hexo.source_dir, source);
    }
    const image = sharp(input);
    const { width, height, hasAlpha } = await image.metadata();
    const thumbnail = image.resize(
        width >= height ? Math.min(size, width) : null,
        width <= height ? Math.min(size, height) : null,
    );
    let thumbnailBase64;
    if (hasAlpha) {
        thumbnailBase64 = 'data:image/png;base64,' + (await thumbnail.png({
            palette: true,
            quality: 100,
            colors: 128,
            compressionLevel: 9,
            effort: 10,
        }).toBuffer()).toString('base64').replace(/=+$/, '');
    } else {
        thumbnailBase64 = 'data:image/jpeg;base64,' + (await image.jpeg({
            quality: 75,
            chromaSubsampling: '4:2:0',
            quantisationTable: 3,
            trellisQuantisation: true,
            overshootDeringing: true,
        }).toBuffer()).toString('base64').replace(/=+$/, '');
    }
    thumbnailCache[cacheKey] = [thumbnailBase64, width, height];
    hexo.log.debug(`Thumbnail created: \x1b[35m${cacheKey}\x1b[39m (\x1b[36m${thumbnailBase64.length}\x1b[39m bytes)`);
    return {
        thumbnailBase64,
        width,
        height,
    };
};

hexo.extend.tag.register(
    'img_blur',
    /**
     * @param {String[]} args
     * @returns {String}
     */
    async function (args) {
        /** @type {Record<String, String>} */
        const sources = {};
        /** @type {Record<String, String>} */
        const attrs = {};
        for (const [attr, argPrefix] of [
            ['data-src-avif', 'avif:'],
            ['data-src-webp', 'webp:'],
            ['data-src', 'src:'],
        ]) {
            const index = args.findIndex(e => e.startsWith(argPrefix));
            if (index === -1) continue;
            sources[attr] = attrs[attr] = args[index].substring(argPrefix.length);
            args.splice(index, 1);
        }
        const [alt, title] = args;
        if (alt) attrs.alt = alt;
        if (title || alt) attrs.title = title || alt;

        for (const format in sources) {
            const source = sources[format];
            if (!source || format === 'data-src-avif') continue;

            try {
                const { thumbnailBase64, width, height } = await createThumbnail(source, 32);
                return `
                    <figure class="akarin-blurred-container">
                        <div style="padding-bottom:min(calc(100%/${width}*${height}),${height}px,480px)"></div>
                        <img
                            class="mdui-img-rounded mdui-hoverable"
                            ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}
                        >
                        <img
                            class="mdui-img-rounded mdui-hoverable akarin-blurred"
                            src="${thumbnailBase64}"
                            ${attrs.alt ? `alt="${attrs.alt}" ` : ''}
                            ${attrs.title ? `title="${attrs.title}" ` : ''}
                        >
                        <noscript>
                            <img
                                class="mdui-img-fluid mdui-img-rounded mdui-center mdui-hoverable"
                                src="${attrs['data-src'] || attrs['data-src-webp'] || attrs['data-src-avif']}"
                                ${attrs.alt ? `alt="${attrs.alt}" ` : ''}
                                ${attrs.title ? `title="${attrs.title}" ` : ''}
                            >
                        </noscript>
                    </figure>
                `;
            } catch (error) {
                hexo.log.warn(`Failed to create thumbnail from \x1b[35m${source}\x1b[39m in \x1b[35m${this.full_source}\x1b[39m (\x1b[31m${error}\x1b[39m)`);
            }
        }
        return `
            <img
                class="mdui-img-fluid mdui-img-rounded mdui-center mdui-hoverable"
                ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}
            >
            <noscript>
                <img
                    class="mdui-img-fluid mdui-img-rounded mdui-center mdui-hoverable"
                    src="${attrs['data-src'] || attrs['data-src-webp'] || attrs['data-src-avif']}"
                    ${attrs.alt ? `alt="${attrs.alt}" ` : ''}
                    ${attrs.title ? `title="${attrs.title}" ` : ''}
                >
            </noscript>
        `;
    },
    {
        async: true,
    },
);

hexo.extend.filter.register('before_post_render', async data => {
    if (data.thumbnail_color) return data;

    for (const source of [
        // 'thumbnail_avif',
        'thumbnail_webp',
        'thumbnail',
    ]) {
        if (!data[source]) continue;
        try {
            data.thumbnail_color = (await createThumbnail.bind(data)(data[source], 64)).thumbnailBase64;
            return data;
        } catch (error) {
            hexo.log.warn(`Failed to create thumbnail from \x1b[35m${data[source]}\x1b[39m in \x1b[35m${data.full_source}\x1b[39m (\x1b[31m${error}\x1b[39m)`);
        }
    }
    return data;
});
