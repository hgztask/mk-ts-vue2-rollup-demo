import './menu'
import "./layout_init";
import router from './router'
import watch from './watch/watch'

window.addEventListener('load', () => {
    console.log('页面加载完成');
    router.staticRoute(document.title, window.location.href);
    watch.addEventListenerUrlChange((newUrl: string, oldUrl: string, title: string) => {
        router.dynamicRouting(title, newUrl);
    })
})

/*
watch.addEventListenerNetwork((url, windowUrl, winTitle, initiatorType) => {
})
*/


