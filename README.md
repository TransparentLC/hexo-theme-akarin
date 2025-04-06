# hexo-theme-akarin

基于 [MDUI](https://www.mdui.org/) 制作，借鉴了 [hexo-theme-material](https://github.com/bolnh/hexo-theme-material) 的样式的自制 Material Design 风格主题。

演示：https://akarin.dev

这个主题不支持 Internet Explorer。

## 主题设置

> 以下的“网站配置”指的是 Hexo 博客目录下的 `_config.yml`，“主题配置”指的是 `theme/hexo-theme-akarin` 目录下的 `_config.yml`（也可以将这一文件以 `_config.hexo-theme-akarin.yml` 的名称放在 Hexo 博客目录）。

安装 Node.js 18 和 [Hexo 6](https://hexo.io/zh-cn/docs/#%E5%AE%89%E8%A3%85)（或以上版本）并成功[建站](https://hexo.io/zh-cn/docs/setup)后，将主题下载到 `theme/hexo-theme-akarin` 目录，执行 `npm install` 安装依赖，然后在网站配置中修改 `theme: hexo-theme-akarin` 即可启用主题。

仅支持使用 Hexo 5 添加的 [PrismJS](https://hexo.io/zh-cn/docs/syntax-highlight.html#PrismJS) 进行代码高亮，未支持 Highlight.js。

### 导航菜单

``` yaml
drawer:
    caption:
    menu:
        主页:
            href: /
            icon: home
        关于:
            href: /about
            icon: person
            divider: true
        深色模式:
            preset: dark
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `caption` | 在菜单上方显示的博客介绍 | 网站配置的 `title` |
| `menu` | 菜单中的项目，显示的文本为每一项的 key |  |
| `menu.key.preset` | 预设的菜单项目，设置了这一项就不需要设置 `href` 和 `icon` |  |
| `menu.key.href` | 指向的链接 |  |
| `menu.key.icon` | 图标，可以在[这里](https://www.mdui.org/docs/material_icon)选择 |  |
| `menu.key.divider` | 在项目下方添加一条分割线 | `false` |

使用 `preset` 可以设置的预设项目：
* `archive`：点击后跳转到归档页面 `/archive`，并在右侧显示文章总数
* `rss`：点击后跳转到主题设置里设定的 RSS 链接
* `dark`：是否启用深色模式的设置，可以设为固定启用/禁用/根据系统主题切换
* `stats_busuanzi`：不算子的访问量统计，支持设置是否显示网站 PV/UV 和网页 PV，参见“访问量统计”部分

### `<head>` 部分

```yaml
head:
    favicon: /img/favicon.png
    high_res_favicon: /img/favicon.png
    apple_touch_icon: /img/favicon.png
    keywords:
    structured_data: true
    site_verification:
        google:
        baidu:
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `favicon` | 网站的 favicon |  |
| `high_res_favicon` | 高清 favicon |  |
| `apple_touch_icon` | iOS 主屏按钮图标，对应 `<link rel="apple-touch-icon">` |  |
| `keywords` | 网站关键词，对应 `<meta name="keywords">` |  |
| `structured_data` | 生成[结构化数据](https://developers.google.com/search/docs/guides/intro-structured-data) | `false` |
| `site_verification` | 搜索引擎验证，对应 `<meta name="***-site-verification">`，支持 Google 和百度 |  |

### 页脚

```yaml
footer:
    since: 2019
    text: Hosted by <a href="https://pages.github.com/" target="_blank">Github Pages</a>
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `since` | 网站建立的年份，显示为 `© 2019 - 2020`，留空则只显示当前年份 |  |
| `text` | 页脚显示的文字，可以用来显示备案号等信息，支持使用 HTML |  |

### 界面设置

```yaml
uiux:
    slogan: This is a slogan.
    sidebar_image: https://picsum.photos/600/400.jpg?blur=10
    sidebar_image_webp: https://picsum.photos/600/400.webp?blur=10
    sidebar_image_avif:
    sidebar_image_color: '#e16b8c'
    banner_image: https://picsum.photos/1200/500.jpg
    banner_image_webp: https://picsum.photos/1200/500.webp
    banner_image_avif:
    banner_image_color: '#e16b8c'
    mdui_primary_theme: pink
    mdui_accent_theme: pink
    post_thumbnail_color: '#03a9f4'
    copy_code_button_color: '#fff'
    top:
        enable: true
        style: fab
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `slogan` | 显示在主页顶部的标语，可以使用数组设定多行标语 |  |
| `avatar` | 头像的 URL |  |
| `sidebar_image` | 导航菜单顶部的背景图 URL |  |
| `sidebar_image_webp` | WebP 格式的导航菜单顶部的背景图 URL |  |
| `sidebar_image_avif` | AVIF 格式的导航菜单顶部的背景图 URL |  |
| `sidebar_image_color` | 背景图未加载时显示的颜色，可以使用各种在线小工具提取上面设置的图片的主题色 |  |
| `banner_image` | 主页顶部的背景图 URL |  |
| `banner_image_webp` | WebP 格式的主页顶部的背景图 URL |  |
| `banner_image_avif` | AVIF 格式的主页顶部的背景图 URL |  |
| `banner_image_color` | 背景图未加载时显示的颜色 |  |
| `mdui_primary_theme` | MDUI 的主题色，参见[这里](https://www.mdui.org/docs/color#color) |  |
| `mdui_accent_theme` | MDUI 的强调色 |  |
| `post_thumbnail_color` | 文章的封面图未加载时显示的颜色，也可以在每一篇文章的 Front-matter 里单独设定，参见[“Front-matter”](#Front-matter)部分 |  |
| `copy_code_button_color` | 文章中“复制代码”按钮的颜色 |  |
| `top.enable` | 是否在页面右下角显示“返回顶部”的按钮 | `false` |
| `top.style` | 设为 `fab` 则以浮动操作按钮显示 |  |

### 文章设置

```yaml
posts:
    default_excerpt: 120
    license: 本作品采用<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `default_excerpt` | 没有使用 `<!-- more -->` 或在 Front-matter 中设置摘要时，则自动截取文章开头的一定数量的字符作为摘要 |  |
| `license` | 文章的版权声明，也可以在 Front-matter 中单独设定，支持使用 HTML |  |

### 友链

```yaml
links:
    default_avatar: /img/Transparent_Akkarin.png
    description:
    list:
        Github:
            link: https://github.com/
            avatar: https://github.githubassets.com/images/modules/open_graph/github-logo.png
            description: 全球最大同性交友网站
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `default_avatar` | 友链的默认头像 |  |
| `description` | 在友链页面上方显示的内容，可以用来显示友链添加方式等信息，支持使用 HTML |  |
| `list` | 友链列表，链接名称为每一项的 key |  |
| `list.key.link` | 地址 |  |
| `list.key.avatar` | 头像 | `theme.links.default_avatar` |
| `list.key.description` | 链接的介绍 |  |

要生成友链页面，你需要在网站的 source 文件夹中自定义一个文件夹（例如 friend），然后在这个文件夹里新建 `index.md`，写入以下内容：

```
---
title: 友链页面标题
layout: links
---
```

### 评论区

```yaml
comment:
    livere:
        enable: false
        uid:
    artalk:
        enable: false
        server:
        site:
        stylesheet:
        script:
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `livere.enable` | 是否启用 LiveRe 评论功能 | `false` |
| `livere.uid` | LiveRe 安装代码中的 `data-uid` 的值 |  |
| `artalk.enable` | 是否启用 Artalk 评论功能 | `false` |
| `artalk.server` | Artalk 后端地址 |  |
| `artalk.site` | 站点名 | `config.title` |
| `artalk.stylesheet` | 从 CDN 引入 Artalk 的 CSS 的地址 | `https://cdn.jsdelivr.net/npm/artalk@2/dist/Artalk.css` |
| `artalk.script` | 从 CDN 引入 Artalk 的 JS 的地址 | `https://cdn.jsdelivr.net/npm/artalk@2/dist/Artalk.js` |

暂时只支持 [LiveRe](https://livere.com/) 和 [Artalk](https://artalk.js.org)。

LiveRe 的评论区在启用深色模式的情况下无法正常显示。

### 访问统计

```yaml
stats:
    busuanzi:
        enable: false
        script: https://cdn.jsdelivr.net/npm/busuanzi
        site_uv: true
        site_pv: true
        page_pv: true
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `busuanzi.enable` | 是否启用不蒜子 | `false` |
| `busuanzi.script` | 加载的 JS | 使用[官方提供的 JS](https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js) |
| `busuanzi.site_uv` | 在导航菜单中的 `preset:stats_busuanzi` 处显示站点访问量 | `false` |
| `busuanzi.site_pv` | 显示站点访客数 | `false` |
| `busuanzi.page_pv` | 显示页面访问量 | `false` |

暂时只支持[不蒜子](https://busuanzi.ibruce.info/)。

### 其它设置

```yaml
rss:
minify:
    enable: true
aplayer:
    script: /js/APlayer.min.js
    stylesheet: /css/APlayer.min.css
stylesheets:
- /css/mdui.min.css
- /css/prism-line-numbers.min.css
- /css/prism-vsc-dark-plus.min.css
- /css/APlayer.min.css
- /css/style.css
scripts:
- /js/mdui.min.js
- /js/medium-zoom.min.js
- /js/APlayer.min.js
- /js/script.js
preconnect:
- https://cdn.jsdelivr.net
dns_prefetch:
- https://example.com
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `rss` | RSS 的路径，留空则导航菜单中的 `preset:rss` 不会显示 |  |
| `minify_html` | 对生成的 HTML 进行压缩，参见[“HTML 压缩”](#html-压缩)部分 |  |
| `aplayer` | [APlayer](https://github.com/DIYgod/APlayer) 使用的 CSS 和 JS，参见[“APlayer 标签插件”](#aplayer-标签插件)部分 |  |
| `stylesheets` | 需要导入的其它 CSS，和 Hexo 的辅助函数 [`css`](https://hexo.io/zh-cn/docs/helpers#css) 相同 |  |
| `scripts` | 需要导入的其它 JS，和 Hexo 的辅助函数 [`js`](https://hexo.io/zh-cn/docs/helpers#js) 相同 |  |
| `preconnect` | 需要添加 `<link rel="preconnect">` 的域名 |  |
| `dns_prefetch` | 需要添加 `<link rel="dns-prefetch">` 的域名 |  |

* 可以使用插件 [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed) 生成 RSS
* 至少需要导入以下 CSS：
    * [MDUI](https://github.com/zdhxiong/mdui/blob/v1/dist/css/mdui.min.css)
    * PrismJS 的任意一个[主题](https://github.com/PrismJS/prism-themes)（如果使用了 PrismJS）
    * PrismJS 的[行号显示插件](https://github.com/PrismJS/prism/blob/master/plugins/line-numbers/prism-line-numbers.css)（如果使用了行号显示功能）
    * 本主题的 [CSS 文件](https://github.com/TransparentLC/hexo-theme-akarin/blob/master/source/css/style.css)
* 至少需要导入以下 JS：
    * [MDUI](https://github.com/zdhxiong/mdui/blob/v1/dist/js/mdui.min.js)
    * [medium-zoom](https://github.com/francoischalifour/medium-zoom#installation)
    * PrismJS 本体和各个插件，参见 [Hexo 文档](https://hexo.io/zh-cn/docs/syntax-highlight.html#preprocess)（如果使用了浏览器端高亮）
    * 本主题的 [JS 文件](https://github.com/TransparentLC/hexo-theme-akarin/blob/master/source/js/script.js)
* 如果对加载速度有更高的要求，可以尝试以下方法：
    * 将主题的 CSS 和 JS 文件进行 minify，相关工具：[Terser](https://try.terser.org/)、[swc](https://swc.rs/)、[lightningcss](https://lightningcss.dev/)
    * 使用 [jsDelivr](https://www.jsdelivr.com/) 等公共 CDN 服务
    * 对于 jsDelivr，可以使用[合并文件](https://www.jsdelivr.com/features#combine)功能，减少网络请求数并提高压缩比，还可以在文件名中加上 `min` 自动 minify
    * 下载 MDUI 的源代码，根据主题配置中设定的主题色和强调色（`theme.uiux.mdui_primary/accent_theme`），去除不需要的主题和组件后自行编译 CSS 和 JS，替换主题自带的完整版。可以参考这里修改源代码 src 目录下的对应文件：[index.ts](https://pastebin.com/VZGCd2pf)、[index.less](https://pastebin.com/bLy8SxRM)

## Front-matter

参见 [Hexo 文档](https://hexo.io/zh-cn/docs/front-matter)，主题还额外支持一些 Front-matter：

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `title` | 标题 | 文件名 |
| `date` | 建立日期 | 文件建立日期 |
| `updated` | 更新日期 | 文件更新日期 |
| `tags` | 标签 |  |
| `categories` | 分类 |  |
| `excerpt` | 摘要 | 从文章的开头一部分截取，长度为 `theme.posts.default_excerpt` |
| `thumbnail` | 封面图 |  |
| `thumbnail_webp` | WebP 格式的封面图 |  |
| `thumbnail_avif` | AVIF 格式的封面图 |  |
| `thumbnail_color` | 封面图未加载时显示的颜色，也可以填入一个图片的 Data URL 或留空以自动生成 |  |
| `hide_license` | 不显示版权声明 | `false` |
| `license` | 文章的版权声明 | `theme.posts.license` |
| `comments` | 是否允许评论 | `true` |
| `author` | 作者的名称，替换网站配置中设定的值 | `config.author` |
| `avatar` | 作者的头像，替换网站配置中设定的值 | `config.avatar` |

关于封面图相关选项的详细介绍，可以参见下面的[“使用现代图片格式和图片渐进式加载”](#使用现代图片格式和图片渐进式加载)部分。

## 各种小功能

### APlayer 标签插件

内置了简单的 [APlayer](https://github.com/DIYgod/APlayer) 标签插件，可以快速在文章中插入音乐播放器。

```plain
{% aplayerlite title author audioURL [coverURL] [lrcURL] %}

{% aplayerlitelrc title author audioURL [coverURL] %}
[00:00.000] LRC歌词内容
[00:01.000] ……
{% endaplayerlitelrc %}
```

使用例：

```plain
{% aplayerlite
    "TOKIMEKI Runners"
    "虹ヶ咲学園スクールアイドル同好会"
    "https://fs-im-kefu.7moor-fs2.com/im/2768a390-5474-11ea-afc9-7b323e3e16c0/lbsgI27N.m4a"
    "https://yzf.qq.com/fsnb/kf-file/kf_pic/20220601/KFPIC_Au_WXIMAGE_007732d2a6c24a438413c7ca925d4dd7.jpg"
    "https://fs-im-kefu.7moor-fs2.com/im/2768a390-5474-11ea-afc9-7b323e3e16c0/T-2g8Whd.txt"
%}
```

在未启用 JS 的环境下，将使用 HTML 原生 `<audio>` 标签插入播放器，并以形如“♪ TOKIMEKI Runners - 虹ヶ咲学園スクールアイドル同好会”的格式显示歌曲名称。

注意：**这个标签插件的功能和使用方法和 [hexo-tag-aplayer](https://github.com/MoePlayer/hexo-tag-aplayer) 并不相同。** 如果它不能满足你的需求，你仍然可以继续选择使用 hexo-tag-aplayer 插件添加音乐播放器。

### 使用现代图片格式和图片渐进式加载

WebP、AVIF 等现代图片格式具有更好的压缩效率，可以节省流量和加载时间。

* 几乎所有的浏览器都[支持](https://caniuse.com/webp) WebP 格式。
* Firefox 77 和 Chrome 85 及之后的版本[支持](https://caniuse.com/avif) AVIF 格式。

图片渐进式加载是在传统的懒加载的基础上进行的进一步优化，在图片加载前以从原图缩小的模糊缩略图作为占位符，以 Data URL 嵌入到网页上并以原图的尺寸显示，加载完成后再以渐变方式从缩略图过渡到原图（具体的效果可以参见静态站点生成器 Gatsby 的插件 gatsby-image 的 [Blur Up 示例](https://using-gatsby-image.gatsbyjs.org/blur-up/)）。这种加载方式符合用户在等待过程中希望图片逐渐被下载的预期，同时也避免了传统的懒加载使用 1px 空白图片或加载动画作为占位符，在原图加载后由于尺寸不同而引起的网页布局抖动问题。

主题对所有的封面图和文章内的插图都支持现代图片格式的自适应和渐进式加载效果，可以根据浏览器的支持情况来决定加载哪一种格式的图片。

对于封面图，可以在 Front-matter 中通过 `thumbnail_{webp,avif}` 指定现代图片格式的路径。如果 `thumbnail_color` 留空，则会自动生成一个不超过 64px 的缩略图作为占位符。

对于文章内的插图，可以通过以下标签插件指定各格式图片的路径：

```plain
{% img_blur
    src:image.jpg
    webp:image.webp
    avif:image.avif
    alt
    title
%}
```

`alt` 和 `title` 是可选的。除传统格式 `src` 外，其他的现代图片格式路径不需要全部指定。在生成网页时会自动生成一个不超过 32px 的缩略图作为的占位符。

图片路径可以是本地资源或在线加载的 URL。生成过的缩略图将根据图片路径和缩略图大小而缓存到主题所在目录的 `thumbnail-cache.json` 文件中。

在未启用 JS 的环境下将直接显示图片。

> 由于图片处理库 [sharp](https://sharp.pixelplumbing.com/) 目前暂不支持 JPEG XL，对 AVIF 的支持也存在一些问题，因此目前只会尝试从 WebP 格式和传统格式的图片生成缩略图。

### HTML 压缩

主题内置了使用 [html-minifier-terser](https://github.com/terser/html-minifier-terser) 实现的 HTML 压缩功能。已有的插件 [hexo-html-minifier](https://github.com/hexojs/hexo-html-minifier) 所依赖的 [html-minifier](https://github.com/kangax/html-minifier) 似乎已经弃坑了。启用压缩可以将 HTML 文件的大小缩减到 70-90% 左右。

在主题配置中将 `minify_html.enable` 设为 `true` 即可启用，还可以添加其它的 html-minifier-terser 压缩选项：

```yaml
minify_html:
    enable: true
    # 以下是默认设定，除非需要覆盖，否则并不需要写入主题配置
    collapseWhitespace: true
    collapseBooleanAttributes: true
    decodeEntities: true
    removeComments: true
    removeRedundantAttributes: true
    removeScriptTypeAttributes: true
    removeStyleLinkTypeAttributes: true
    removeEmptyAttributes: true
    useShortDoctype: true
    sortAttributes: true
    sortClassName: true
    processConditionalComments: true
    processScripts:
        - application/ld+json
    minifyCSS: true
    minifyJS: true
```

### MathJax 公式渲染

主题内置了使用 [MathJax](https://www.mathjax.org) 渲染数学公式的功能。如果你正在使用 [hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked) 渲染器，则无需额外配置，直接在正文输入公式就可以自动以 SVG 格式渲染了。

**注意：公式与非公式之间必须用空格分隔。**

行内公式：

```md
$ax^2 + bx + c = 0$
```

行间公式：

```md
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

$$
    \begin{align}
        \dot{x} & = \sigma(y-x) \\
        \dot{y} & = \rho x - y - xz \\
        \dot{z} & = -\beta z + xy
    \end{align}
$$
```
