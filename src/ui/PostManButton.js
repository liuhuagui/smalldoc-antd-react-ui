import React, { useState } from 'react';
import { Button, Radio, message } from 'antd';
import { formData } from '../util/Utils'
import { pathVariableRegex, GET, HEAD, POST } from "../util/Constants";

const send = ({ urlPath, selectedRows, urlMethod = POST, showDrawer }) => {
    const newJSONForm = {};
    selectedRows.forEach(record => {
        const examples = record.example;
        if (Array.isArray(examples) && examples.length > 0) {
            console.log(examples[0] instanceof File)
            newJSONForm[record.name] = examples[0];
        } else {
            newJSONForm[record.name] = record.example;
        }
    });
    urlPath = urlPath.replace(pathVariableRegex, (m, p1) => newJSONForm[p1]);
    console.log(urlPath);
    console.log(newJSONForm);
    console.log(urlMethod);
    console.log(showDrawer);
    console.log('----');
    let body = null;
    if (urlMethod === HEAD) {
    } else if (urlMethod === GET) {
        const serializedKV = Object.entries(newJSONForm).map(([key, value]) => { console.log(typeof value); return `${key}=${value}`; }).join("&");
        urlPath = `${urlPath}?${serializedKV}`;
    } else {
        body = formData(newJSONForm);
    }
    console.log(urlPath)
    fetch(urlPath, { method: urlMethod, body })
        .then(response => {
            if (response.ok)
                return response.text();//为了切换到raw，默认返回text
            throw new Error(`Request is failed, status is ${response.status}`);
        }).then(
            data => {
                showDrawer(data, urlPath);
            },
            reason => {
                message.error(reason);
            }
        );
};


export default (props) => {
    const [redioValue, setRedioValue] = useState(1);
    const onChangeRedioValue = e => setRedioValue(e.target.value);
    return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <b>请求参数:</b>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Button type="primary" size='small' onClick={() => send(props)} style={{ marginRight: 20 }}>Send</Button>
            <Radio.Group onChange={onChangeRedioValue} value={redioValue}>
                <Radio value={1}>form-data</Radio>
                <Radio value={2}>x-www-form-urlencoded</Radio>
            </Radio.Group>
        </div>
    </div>
};