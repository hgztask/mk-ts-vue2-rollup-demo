/**
 * 判断一个变量是否是DOM元素
 * @returns {boolean} 如果是DOM元素返回true，否则返回false
 */
const isDOMElement = (obj: any | Element): boolean => {
    // 检查是否为非null对象，且具有nodeType属性
    return (obj !== null && typeof obj === 'object' && 'nodeType' in obj);
}

//存储进行中的查询（未 resolve 的 Promise）
const inProgressCache = new Map();

//配置默认的验证元素函数
const validationElFun = (config: any, selector: string) => {
    const element = config.doc.querySelector(selector);
    if (element === null) return null;
    return config.parseShadowRoot && element.shadowRoot ?
        element.shadowRoot : element;
}

//私有最后验证的元素
const __privateValidationElFun = (config: any, selector: string) => {
    const result = config.validationElFun(config, selector);
    return isDOMElement(result) ? result : null;
}

type findElementType = {
    selector: string,
    config: any,
    validationElFun: (config: findElementType, selector: string) => any
    interval: number,
    timeout: number,
    parseShadowRoot: boolean,
    cacheInProgress: boolean
}

/**
 * @version 0.3.0
 */
export default {
    /**
     * 持续查找单个元素，每次查找之间有指定的间隔时间，直到找到为止
     * 查找时存在则直接返回，
     * 结合异步操作 await 可用于监听元素加载完成之后继续执行
     * @param {string} selector - CSS 选择器，用于选择元素
     * @param {Object} [config={}] - 配置对象
     * @param {Document|Element|ShadowRoot} [config.doc=document] - 查找的文档对象
     * @param {number} [config.interval=1000] - 每次查找之间的间隔时间（毫秒）
     * @param {number} [config.timeout=-1] - 超时时间（毫秒，-1 表示无限等待）
     * @param {boolean} [config.parseShadowRoot=false] - 是否解析 shadowRoot（当元素有 shadowRoot 时返回 shadowRoot）
     * @param {boolean} [config.cacheInProgress=true] - 是否缓存进行中的查询（避免重复轮询）
     * @param {function(config: {}): Element|ShadowRoot,selector:string} [config.validationElFun] - 找到的元素的验证函数，返回元素/ShadowRoot，或者 null
     * @returns {Promise<Element|ShadowRoot|null>} - 返回找到的元素/ShadowRoot，超时返回 null
     */
    async findElement(selector: string, config: findElementType | any = {}): Promise<Element | ShadowRoot | null> {
        const defConfig = {
            doc: document,
            interval: 1000,
            timeout: -1,
            parseShadowRoot: false,
            cacheInProgress: true,
            validationElFun
        }
        config = {...defConfig, ...config}
        const result = __privateValidationElFun(config, selector);
        if (result !== null) return result;
        const cacheKey = `findElement:${selector}`
        if (config.cacheInProgress) {
            const cachedPromise = inProgressCache.get(cacheKey);
            if (cachedPromise) {
                return cachedPromise;
            }
        }
        const p: Promise<Element | ShadowRoot | null> = new Promise((resolve) => {
            let timeoutId: number, IntervalId;
            IntervalId = setInterval(() => {
                const result = __privateValidationElFun(config, selector);
                if (result === null) return;
                resolve(result)
            }, config.interval);
            const cleanup = () => {
                if (IntervalId) clearInterval(IntervalId);
                if (timeoutId) clearTimeout(timeoutId);
                if (config.cacheInProgress) {
                    inProgressCache.delete(cacheKey);
                }
            }
            if (config.timeout > 0) {
                timeoutId = setTimeout(() => {
                    resolve(null);
                    cleanup()
                }, config.timeout);
            }
        });
        if (config.cacheInProgress) {
            inProgressCache.set(cacheKey, p);
        }
        return p;
    }
    ,
    /**
     * 持续查找多个个元素，每次查找之间有指定的间隔时间，直到找到为止
     * 结合异步操作await可用于监听元素加载完成之后继续执行
     * 如设置超时时间超过指定时间后，将返回空数组
     * @param {string} selector - CSS 选择器，用于选择元素
     * @param config{{}} 配置对象
     * @param config.doc {Document|Element|ShadowRoot}- 查找的文档对象，默认为document
     * @param config.interval  {number} - 每次查找之间的间隔时间（毫秒）默认1秒，即1000毫秒
     * @param config.timeout  {number} - 超时时间（毫秒）默认-1，去问问1即无限等待
     * @param config.parseShadowRoot  {boolean} - 如匹配元素为shadowRoot时，是否解析shadowRoot，默认为false
     * @returns {Promise<Element[]>}-返回找到的Element列表，如设置超时超出时间则返回空数组
     */
    async findElements(selector: string, config: any = {}): Promise<Element[]> {
        const defConfig = {doc: document, interval: 1000, timeout: -1, parseShadowRoot: false}
        config = {...defConfig, ...config}
        return new Promise((resolve) => {
            const i1 = setInterval(() => {
                const els = config.doc.querySelectorAll(selector);
                if (els.length > 0) {
                    const list: Element[] = [];
                    for (const el of els) {
                        if (config.parseShadowRoot) {
                            const shadowRoot = el?.shadowRoot;
                            list.push(shadowRoot ? shadowRoot : el)
                            continue;
                        }
                        list.push(el);
                    }
                    resolve(list);
                    clearInterval(i1)
                }
            }, config.interval);
            if (config.timeout > 0) {
                setTimeout(() => {
                    clearInterval(i1);
                    resolve([]); // 超时则返回 空数组
                }, config.timeout);
            }
        });
    },
    isDOMElement,
    // 更新弹窗样式
    updateCssVModal() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `.v-modal  {
    z-index: auto !important;
}`
        document.head.appendChild(styleEl)
    },
    /**
     * 安装样式
     * @param cssText {string} - CSS 样式字符串
     * @param selectorOptions {{type:'class'|'id'|any,value:string}}
     */
    installStyle(cssText: string, selectorOptions: { type: 'class' | 'id' | any, value: string } | any) {
        const {type = 'class', value = '', doc = document.head} = selectorOptions ? selectorOptions : {};
        let selector = '';
        switch (type) {
            case "class":
                selector = `.${value}`;
                break;
            case 'id':
                selector = `#${value}`;
                break;
            default:
                selector = `[${type}="${value}"]`;
        }
        let styleEl = doc.querySelector(selector);
        if (styleEl === null) {
            styleEl = document.createElement('style');
            switch (type) {
                case "class":
                    styleEl.className = value;
                    break;
                case 'id':
                    styleEl.id = value;
                    break
                default:
                    styleEl.setAttribute(type, value);
                    break;
            }
            doc.appendChild(styleEl)
        }
        styleEl.textContent = cssText;
    },
    /**
     * 创建一个Vue容器
     * @description 创建一个Vue容器，用于挂载Vue组件，如如传入el，则将容器挂载到该元素下，不管el是否存在，都将创建一个容器，并返回容器的元素。
     * @param el {Element} 容器要挂载的元素，vue容器
     * @param cssTests {string|null} 要为创建的容器添加的样式，如为null，则不添加样式
     */
    createVueDiv(el: Element | null = null, cssTests: string | null = null) {
        const panelDiv = document.createElement('div');
        if (cssTests !== null) {
            panelDiv.style.cssText = cssTests;
        }
        const vueDiv = document.createElement("div");
        panelDiv.appendChild(vueDiv);
        if (el !== null) {
            el.appendChild(panelDiv);
        }
        return {panelDiv, vueDiv}
    },
    //xpath定位元素，返回匹配第一个元素，按文档顺序
    byXpathEl(xpatch: string, doc: any = document): Node | null | HTMLElement {
        return document.evaluate(xpatch, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    },
    //异步xpath定位元素，返回匹配第一个元素，按文档顺序
    async byXpathElAsync(xpatch: string, doc: any = document, timeout: number = 1000): Promise<Node | null | HTMLElement> {
        return new Promise((resolve) => {
            let xpathEl = this.byXpathEl(xpatch, doc);
            if (xpathEl !== null) {
                return resolve(xpathEl);
            }
            const interval = setInterval(() => {
                xpathEl = this.byXpathEl(xpatch, doc);
                if (xpathEl === null) return
                resolve(xpathEl);
                clearInterval(interval)
            }, timeout);
        })
    },
    //xpath定位元素，返回元素列表
    byXpathEls(xpatch: string, doc: any = document) {
        const xPathResult = document.evaluate(xpatch, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const elList = []
        for (let i = 0; i < xPathResult.snapshotLength; i++) {
            const items = xPathResult.snapshotItem(i);
            if (items === null) continue;
            elList.push(items)
        }
        return elList
    },
    //xpath定位元素，返回数字
    byXpathNumber(xpatch: string, doc: any = document) {
        return document.evaluate(xpatch, doc, null, XPathResult.NUMBER_TYPE, null).numberValue;
    },
    //xpath定位元素，返回字符串
    byXpathString(xpatch: string, doc: any = document) {
        return document.evaluate(xpatch, doc, null, XPathResult.STRING_TYPE, null).stringValue;
    },
    //xpath定位元素，返回布尔值，是否存在
    byXpathBoolean(xpatch: string, doc: any = document) {
        return document.evaluate(xpatch, doc, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    }
}
