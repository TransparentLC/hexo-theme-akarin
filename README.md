# hexo-theme-akarin

基于 [MDUI](https://www.mdui.org/) 制作，借鉴了 [hexo-theme-material](https://github.com/bolnh/hexo-theme-material) 的样式的自制 Material Design 风格主题。

演示：https://akarin.dev

这个主题不支持 Internet Explorer。

## 主题设置

> 以下的“网站配置”指的是 Hexo 博客目录下的 _config.yml，“主题配置”指的是 theme/hexo-theme-akarin 目录下的 _config.yml。

[安装 Hexo](https://hexo.io/zh-cn/docs/#%E5%AE%89%E8%A3%85) 并成功[建站](https://hexo.io/zh-cn/docs/setup)后，将主题下载到 theme/hexo-theme-akarin 目录，然后在网站配置中修改 `theme: hexo-theme-akarin` 即可启用主题。

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
    avatar: https://picsum.photos/200/200.webp
    sidebar_image: https://picsum.photos/600/400.webp?blur=10
    sidebar_image_color: '#e16b8c'
    banner_image: https://picsum.photos/1200/500.webp
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
| `sidebar_image_color` | 背景图未加载时显示的颜色，可以使用各种在线小工具提取上面设置的图片的主题色 |  |
| `banner_image` | 主页顶部的背景图 URL |  |
| `banner_image_color` | 背景图未加载时显示的颜色 |  |
| `mdui_primary_theme` | MDUI 的主题色，参见[这里](https://www.mdui.org/docs/color#color) |  |
| `mdui_accent_theme` | MDUI 的强调色 |  |
| `post_thumbnail_color` | 文章的封面图未加载时显示的颜色，也可以在每一篇文章的 Front-matter 里单独设定，参见“Front-matter”部分 |  |
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

要生成友链页面，你需要在网站的 source 文件夹中自定义一个文件夹（例如 friend），然后在这个文件夹里新建 index.md，写入以下内容：

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
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `livere.enable` | 是否启用 LiveRe 评论功能 | `false` |
| `livere.uid` | LiveRe 安装代码中的 `data-uid` 的值 |  |

暂时只支持 [LiveRe City 版](https://livere.com/)。

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
mathjax:
rss:
stylesheets:
- /css/mdui.min.css
- /css/prism-line-numbers.min.css
- /css/prism-vsc-dark-plus.min.css
- /css/style.css
scripts:
- /js/mdui.min.js
- /js/medium-zoom.min.js
- /js/script.js
```

| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `mathjax` | 加载 MathJax 的路径 | 使用 [jsDelivr 的 CDN](https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js) |
| `rss` | RSS 的路径，留空则导航菜单中的 `preset:rss` 不会显示 |  |
| `stylesheets` | 需要导入的其它 CSS|  |
| `scripts` | 需要导入的其它 JS |  |

* MathJax 体积较大，因此需要在 Front-matter 中单独设定是否加载
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
    * 将主题的 CSS 和 JS 文件进行 minify，相关工具：[Terser](https://xem.github.io/terser-online/)、[clean-css](https://jakubpawlowicz.github.io/clean-css/)
    *  使用 [hexo-html-minifier](https://github.com/hexojs/hexo-html-minifier) 也可以对生成的网页进行 minify
    * 使用 [jsDelivr](https://www.jsdelivr.com/) 等公共 CDN 服务
    * 对于 jsDelivr，可以使用[合并文件](https://www.jsdelivr.com/features#combine)功能，减少网络请求数并提高压缩比，还可以在文件名中加上 `min` 自动 minify
    * 下载 MDUI 的源代码，根据主题配置中设定的主题色和强调色（`theme.uiux.mdui_primary/accent_theme`），去除不需要的主题和组件后自行编译 CSS 和 JS，替换主题自带的完整版。可以参考这里修改源代码 src 目录下的对应文件：[index.ts](https://pastebin.com/VZGCd2pf)、[index.less](https://pastebin.com/bLy8SxRM)

### Front-matter

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
| `thumbnail_webp` | WebP 格式的封面图，参见“使用现代图片格式”部分 |  |
| `thumbnail_avif` | AVIF 格式的封面图 |  |
| `thumbnail_color` | 封面图未加载时显示的颜色，也可以填入一个图片的 Data URL |  |
| `mathjax` | 在文章中加载 MathJax | `false` |
| `hide_license` | 不显示版权声明 | `false` |
| `license` | 文章的版权声明 | `theme.posts.license` |
| `comments` | 是否允许评论 | `true` |

可以将封面图缩放到一个较小的尺寸（例如高度不超过 48px），然后转换为 Data URL 填入 `thumbnail_color`，在清晰的封面图进入视区而还未加载的时候就会先显示模糊的缩略图，加载完成后再渐变为清晰版。

这个缩略图的大小建议控制在 2 KB 左右。

### 使用现代图片格式

现代图片格式具有更好的压缩效率，节省流量和加载时间。主题对所有的封面图和文章内的插图都支持懒加载和 WebP、AVIF 两种现代图片格式的自适应，可以根据浏览器是否支持某种图片格式来决定是否需要加载对应的图片。几乎所有的浏览器都[支持](https://caniuse.com/#feat=webp) WebP 格式，Firefox 77 和 Chrome 85 已经开始[支持](https://caniuse.com/#feat=avif) AVIF 格式。

由于 Markdown 的 `![]()` 标记只能为图片指定一个 URL，要在文章中使用现代图片格式，需要直接使用 `<img>` 标签：

```html
<img
    data-src="image.jpg"
    data-src-webp="image.webp"
    data-src-avif="image.avif"
>
```