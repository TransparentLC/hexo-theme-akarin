const nonce = Math.random().toString(16).substring(2, 10);
const te = new TextEncoder;
const mystery = te.encode('expand 32-byte k');

/*
文章片段加密

使用 {% encrypt password hint %} 和 {% encryptend %} 包裹需要加密的部分
hint 是可选的，会出现在密码输入框的 placeholder 中

实现方式：

1. 根据 Markdown 文件路径和待加密的 HTML 内容使用 HKDF SHA-256 生成 16 + 12 bytes 的 salt 和 IV
2. 使用 PBKDF2 SHA-256 和 salt 从 password 获取 16 bytes 的 key
3. 使用 key 和 IV 对 HTML 内容进行 AES-GCM 加密
4. 将 salt + IV 和密文写入最后生成的 HTML
*/

hexo.extend.tag.register(
    'encrypt',
    /**
     * @param {String[]} args
     * @returns {String}
     */
    async function (args) {
        const password = args[0].trim();
        const hint = args.slice(1).join(' ').trim();
        if (!password) throw new Error('Password is empty');
        return `<encrypt-fragment-${nonce} data-hint="${hint}" data-password="${password}">`;
    },
    { async: true },
);

hexo.extend.tag.register('encryptend', () => `</encrypt-fragment-${nonce}>`);

hexo.extend.filter.register('after_render:html', async (str, data) => {
    /** @type {Map<string, [Uint8Array, Uint8Array, string]>} */
    const encryptFragment = new Map;
    /** @type {Promise<void>[]} */
    const encryptPromises = [];
    let counter = 0;

    str = str.replace(new RegExp(`<encrypt-fragment-${nonce} data-hint(?:="(.*?)")? data-password(?:="(.*?)")?>([\\s\\S]*?)</encrypt-fragment-${nonce}>`, 'g'), (...m) => {
        const encryptFragmentId = `${data.page.path}#${counter++}`;

        encryptPromises.push((async () => {
            /** @type {String} */
            const password = (m[2] ?? '').trim();
            /** @type {String} */
            const hint = (m[1] ?? '').trim();
            const html = te.encode(m[3].trim());
            const saltiv = new Uint8Array(await crypto.subtle.deriveBits(
                {
                    name: 'HKDF',
                    hash: 'SHA-256',
                    salt: mystery,
                    info: te.encode(data.page.path),
                },
                await crypto.subtle.importKey('raw', html, 'HKDF', false, ['deriveBits']),
                128 + 96,
            ));
            const salt = saltiv.subarray(0, 16);
            const iv = saltiv.subarray(16, 16 + 12);
            // console.time('derive key ' + encryptFragmentId);
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    hash: 'SHA-256',
                    salt,
                    iterations: 600000,
                    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
                    // PBKDF2-HMAC-SHA256: 600,000 iterations
                },
                await crypto.subtle.importKey('raw', te.encode(password), 'PBKDF2', false, ['deriveKey']),
                { name: 'AES-GCM', length: 128 },
                false,
                ['encrypt'],
            );
            // console.timeEnd('derive key ' + encryptFragmentId);
            const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, html));
            encryptFragment.set(encryptFragmentId, [saltiv, encrypted, hint]);
        })());

        return `<!-- ${nonce} encrypt fragment ${btoa(encryptFragmentId)} -->`;
    });

    await Promise.all(encryptPromises);

    return str.replace(
        new RegExp(`<!-- ${nonce} encrypt fragment ([A-Za-z\\d+/]+?=*?) -->`, 'g'),
        (...m) => {
            const [saltiv, encrypted, hint] = encryptFragment.get(atob(m[1]));
            // <div
            //     class="mdui-card mdui-center mdui-m-y-3 mdui-hoverable"
            //     data-saltiv="${Buffer.from(saltiv).toString('base64').replace(/=+$/g, '')}"
            //     data-encrypted="${Buffer.from(encrypted).toString('base64').replace(/=+$/g, '')}"
            // >
            //     <div class="mdui-card-content mdui-text-center">
            //         <div class="mdui-typo-subheading">输入密码查看隐藏内容</div>
            //         <noscript><div class="mdui-typo-caption-opacity">请启用 JavaScript 查看隐藏内容</div></noscript>
            //         <input type="password" class="mdui-m-y-2 mdui-p-a-1" placeholder="${hint}">
            //         <button class="mdui-btn mdui-btn-block mdui-ripple mdui-text-color-theme-accent">提交</button>
            //     </div>
            // </div>
            return `<div class="mdui-card mdui-center mdui-m-y-3 mdui-hoverable" data-saltiv="${Buffer.from(saltiv).toString('base64').replace(/=+$/g, '')}" data-encrypted="${Buffer.from(encrypted).toString('base64').replace(/=+$/g, '')}"><div class="mdui-card-content mdui-text-center"><div class="mdui-typo-subheading">输入密码查看隐藏内容</div><noscript><div class="mdui-typo-caption-opacity">请启用 JavaScript 查看隐藏内容</div></noscript><input type="password" class="mdui-m-y-2 mdui-p-a-1"${hint ? ` placeholder="${hint}"` : ''}><button class="mdui-btn mdui-btn-block mdui-ripple mdui-text-color-theme-accent">提交</button></div></div>`;
        },
    );
}, 30);
