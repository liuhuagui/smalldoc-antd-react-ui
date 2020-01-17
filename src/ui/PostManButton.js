import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import { formData } from '../util/Utils'

const send = ({ urlPath, jsonForm, urlMethod = 'POST', showDrawer }) => {
    console.log(urlPath);
    console.log(jsonForm);
    console.log(urlMethod);
    console.log(showDrawer);
    console.log('----');
    fetch(urlPath, { method: urlMethod, body: null })
        .then(response => {
            if (response.ok)
                return response.text();
            throw new Error(`Request is failed, status is ${response.status}`);
        }).then(
            data => {
                const dataType = typeof data;
                if (dataType === 'object')
                    showDrawer(data);
                if (dataType === 'string')
                    showDrawer(data);
            },
            reason => {
                console.log(reason);
            }
        );
};


export default (props) => {
    const [redioValue, setRedioValue] = useState(1);
    const onChange = e => setRedioValue(e.target.value);
    return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <b>请求参数:</b>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Button type="primary" size='small' onClick={() => send(props)} style={{ marginRight: 20 }}>Send</Button>
            <label><b>Reponse Body&nbsp;</b></label>
            <Radio.Group onChange={onChange} value={redioValue}>
                <Radio value={1}>Pretty</Radio>
                <Radio value={2}>Raw</Radio>
            </Radio.Group>
        </div>
    </div>
};