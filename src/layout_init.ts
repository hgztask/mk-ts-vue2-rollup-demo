import defUtil from "./utils/defUtil";
import App from "./App.vue";
import elUtil from "./utils/elUtil";
import defaultStyle from "./css/def.css";
import gzStyle from "./css/gz-style.css";
// 初始化布局
export default () => {
    if (document.head.querySelector('#element-ui-css') === null) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css'
        linkElement.id = 'element-ui-css'
        document.head.appendChild(linkElement)
        const handler = () => {
            linkElement.removeEventListener('load', handler)
            console.log('element-ui样式加载完成')
        }
        linkElement.addEventListener('load', handler)
    }
    const {vueDiv} = elUtil.createVueDiv(document.body);
    defUtil.initVueApp(vueDiv, App);
    GM_addStyle(defaultStyle)
    GM_addStyle(gzStyle)
    // elUtil.updateCssVModal();
}