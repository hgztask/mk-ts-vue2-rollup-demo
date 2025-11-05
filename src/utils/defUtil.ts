import Vue from "vue";

export default {
    /**
     * 等待一段时间
     * @param milliseconds{number} 等待时间，单位毫秒，默认1000毫秒，即1秒
     */
    wait(milliseconds: number = 1000): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    initVueApp(el: Element, App: any, props = {}) {
        return new Vue({
            render: h => h(App, {props})
        }).$mount(el);
    },
    /**
     *获取localStorage指定key数据
     * 如Key不存在则返回默认值
     * 如指定isList为true,则返回数组
     * @param key {string}
     * @param isList {boolean} 是否是数组
     * @param defaultValue {any}
     * @returns {any|string|boolean|number|[]}
     */
    getLocalStorage(key: string, isList = false, defaultValue: any = null): any | string | boolean | number | [] {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        if (isList) {
            try {
                return JSON.parse(item)
            } catch (e) {
                console.error(`读取localStorage时尝试转换${key}的值失败`, e)
                return defaultValue
            }
        }
        return item
    },
    /**
     * 内容导出为文件
     * @param {String}content 内容
     * @param {String}fileName 文件名
     */
    fileDownload(content: string, fileName: string) {
        // 获取导出文件内容
        // 创建隐藏的下载文件链接
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        // 手动触发下载
        element.click();
        // 清理dom
        document.body.removeChild(element);
    },
    /**
     * 保存大文本到文件
     * @param text {string} 文本内容
     * @param filename {string} 文件名
     */
    saveTextAsFile(text: string, filename: string = 'data.txt') {
        // 创建Blob对象（处理大文本）
        const blob = new Blob([text], {type: 'text/plain'});
        // 创建下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        // 触发下载
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 清理
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
        }, 100);
    }
}
