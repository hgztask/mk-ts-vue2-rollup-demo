export default {
    //静态路由
    staticRoute(url: string, title: string) {
        console.log("静态路由", url, title)
    },
    //动态路由
    dynamicRouting(url: string, title: string,) {
        console.log("动态路由", url, title);
    }
}
