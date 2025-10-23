/**
 * 获取elData数据
 * @param key {string}
 * @param defValue {any|null} 如果不存在该值时返回默认值，默认null
 * @returns {any}
 */
const getData = (key: string, defValue: any | null = null): any => {
    const el = document.querySelector('#mk_data');
    if (el === null) {
        return defValue
    }
    const text = el.textContent.trim();
    const parse = JSON.parse(text);
    if (parse[key]) {
        return parse[key]
    }
    return defValue
}


/**
 * 添加数据
 * 当key存在时更新key的值
 * @param key {string}
 * @param value {string|number|boolean}
 */
const addData = (key: string, value: string | number | boolean) => {
    const el = document.querySelector('#mk_data');
    if (el === null) {
        const mk_data = document.createElement('div');
        mk_data.id = 'mk_data';
        mk_data.style.display = 'none';
        document.head.appendChild(mk_data);
        mk_data.textContent = JSON.stringify({[key]: value});
        return
    }
    const txt = el.textContent.trim();
    const parse = JSON.parse(txt);
    parse[key] = value;
    el.textContent = JSON.stringify(parse);
}

/**
 *设置数据
 * 当key存在时更新key的值
 * @param key {string}
 * @param value {string|number|boolean}
 */
const setData = (key: string, value: string | number | boolean) => {
    addData(key, value);
}


export default {
    addData,
    getData,
    setData
}
