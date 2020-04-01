import React, { useState } from 'react';
import { Button, Radio, message } from 'antd';
import { formData } from '../util/Utils'
import { pathVariableRegex, GET, HEAD, POST } from "../util/Constants";

const send = ({ urlPath, selectedRows, urlMethod = POST, showDrawer }) => {
    const newJSONForm = {};
    selectedRows.forEach(record => {
        newJSONForm[record.name] = record.example;
    });
    const pathVariables = [];
    urlPath = urlPath.replace(pathVariableRegex, (m, p1) => { pathVariables.push(p1); return newJSONForm[p1]; });
    
    let body = null;
    if (urlMethod === HEAD) {
        //TODO
    }
    else if (urlMethod === GET) {
        const serializedKV = Object.entries(newJSONForm)
            .filter(([key, value]) => !pathVariables.includes(key))
            .map(([key, value]) => `${key}=${value}`).join("&");
        if (serializedKV)
            urlPath = `${urlPath}?${serializedKV}`;
    }
    else {
        body = formData(newJSONForm);
    }
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
                message.error(reason.toString());
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