import React from 'react';
import { Button, message } from 'antd';

/**
 * 将对象构造成FormData —— 最终key被作为name
 * @param {*} json 需要构造的对象。属性一般采用速记写法，保证变量名作为key，特殊的可以明确定义出来。
 */
export function formData(json) {
    const formData = new FormData();
    Object.keys(json).forEach(key => {
        formData.append(key, json[key]);
    });
    return formData;
};

const warning = (qtype) => {
    message.warning('这是一个复杂对象：' + qtype);
};

/**
 * 根据完全限定名解析Bean，可能是普通bean也可能是包含TypeVariable字段的bean。
 * @param {String} pendingType 
 * @param {Object} beans 
 */
function Bean(type, beans) {
    let pendingType = type.qtype;
    let fields = beans[pendingType];
    let typeArguments;
    //2. 如果不是实体类型，则判断是否拥有类型参数。
    //3. 如果拥有单个类型参数，尝试解析该参数，比如："java.util.List<T>"
    if (!fields && (typeArguments = type.typeArguments) && typeArguments.length === 1)
        return new Bean(typeArguments[0], beans)
    return { fields, pendingType };
}

/**
 * 递归解析泛型参数
 * @param {Objet} param0 
 */
const parseTypeArguments = ({ typeArguments }, beans) => {
    if (typeArguments && typeArguments.length > 0) {
        let i = 0;
        return <span>
            {'<'}
            {typeArguments.map((t, index) => {
                return <span key={index}>
                    {typeButton(t.type, t, beans)}
                    {++i < typeArguments.length ? ',' : '>'}
                </span>
            })}
        </span>
    }
    return null;
}

export const typeButton = (text, t, beans) => {
    return <span id='type-button'>
        {beans[t.qtype] ? <Button type='link' onClick={() => warning(t.qtype)}>{text}</Button> : text}
        {parseTypeArguments(t, beans)}
    </span>
}

/**
 * 递归解析返回参数
 * @param {*} fields 
 * @param {*} hierarchy 
 * @param {*} beans 
 * @param {String} ownerType 字段拥有者的类型，作为参考，解决循环引用造成的递归问题
 */
export const parseReturnArguments = (fields, hierarchy, beans, ownerType) => {
    fields.forEach(field => {
        field.hierarchy = hierarchy++;
        //首先根据完全限定名解析Bean
        let { fields, pendingType } = new Bean(field, beans);
        //1. 是实体类型
        //2. 与拥有者类型不同（否则会造成循环引用，堆栈溢出）
        if (fields && pendingType !== ownerType) {
            //防止污染beans，做深copy
            const fields_copy = JSON.parse(JSON.stringify(fields));
            field.children = fields_copy;
            parseReturnArguments(fields_copy, hierarchy, beans, pendingType)
        }
    });
}