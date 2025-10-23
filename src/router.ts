/**
 * 静态路由
 * @param title {string} 标题
 * @param url {string} url地址
 */
const staticRoute = (title: string, url: string) => {
    console.log("静态路由", title, url)
}

/**
 * 动态路由
 * @param title {string} 标题
 * @param url {string} url地址
 */
const dynamicRouting = (title: string, url: string) => {
    console.log("动态路由", title, url);
}

export default {
    staticRoute,
    dynamicRouting
}
