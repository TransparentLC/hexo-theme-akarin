/*
 * 这是使用ES6重写的不蒜子的原版JS的简化版，minify以后的文件大小只有424 Bytes，是原版的1884 Bytes的22.5%。
 * 原版：https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js
 * 简化版和原版一样，实现了以下功能：
 * 1. 在busuanzi_value_***中写入计数
 * 2. 获取计数成功/失败后，将busuanzi_container_***的display设为inline/none
 * 3. 执行后，自动清理为了使用JSONP而在window上添加的函数和插入的<script>标签
 */

(document => {

let id = id => document.getElementById(id) || { style: {} };

let key = ['site_pv', 'site_uv', 'page_pv'];

_ = obj => {
    delete _;
    key.forEach(e => id(`busuanzi_value_${e}`).innerText = obj[e]);
};

let loaded = (el, success) => {
    key.forEach(e => id(`busuanzi_container_${e}`).style.display = success ? 'inline' : 'none');
    document.body.removeChild(el);
};

let el = document.createElement('script');
el.onload = () => loaded(el, true);
el.onerror = () => loaded(el, false);
el.src = 'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=_';
document.body.appendChild(el);

})(document)