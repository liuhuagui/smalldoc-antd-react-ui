/**
 * 将对象构造成FormData —— 最终key被作为name
 * @param {*} o 需要构造的对象。属性一般采用速记写法，保证变量名作为key，特殊的可以明确定义出来。
 */
export function form(o) {
    const form = new FormData();
    Object.keys(o).forEach(key => {
        form.append(key, o[key]);
    });
    return form;
};

/**
 * fetch API 的一般使用方式
 * @param {String} url  请求url
 * @param {Object} jsonForm  需要转成`FormData`的普通对象
 * @param {Function} onfulfilled 响应成功的回调函数
 * @param {String} method 请求method类型，默认`post`
 * @param {Function} onrejected  响应失败的回调函数，默认打印错误日志
 */
export const generalFetch = (url, jsonForm, onfulfilled, method = 'post', onrejected = (error)=>console.error(error) ) => {
    fetch(url, {
        method,
        body: form(jsonForm)
    }).then((response) => {
        if (response.ok)
            return response.json();
        throw new Error(`Request is failed, status is ${response.status}`);
    }).then(
        onfulfilled,
        onrejected
    );
}

