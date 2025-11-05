import './menu'
import "./layout_init";
import router from "./router";
import watch from "./watch/watch";
import layout_init from "./layout_init";

window.addEventListener('DOMContentLoaded', () => {
    layout_init();
    router.staticRoute(window.location.href, document.title);
    watch.addEventListenerUrlChange((newUrl: string, oldUrl: string, title: string) => {
        router.dynamicRouting(newUrl, title);
    })
})

window.addEventListener('load', () => {
    console.log('页面加载完成');
})
