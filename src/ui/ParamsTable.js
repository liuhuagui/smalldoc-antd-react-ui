import React, { useState } from 'react';
import { Table, Drawer, Radio, Tooltip } from 'antd';
import PostManButton from './PostManButton';
import { typeButton } from "../util/Utils";
import EditableCell from "./EditableCell";
import ReactJson from 'react-json-view'
import "../css/editable.css";


/**
 * 可写属性，必要时需要做Copy，防止数据被污染
 */
export default ({ datas, beans, ...otherProps }) => {
    const columns = [
        {
            title: '参数名称',
            dataIndex: 'name',
            width: 250,
            fixed: 'left',
        },
        {
            title: '类型',
            dataIndex: 'type',
            render: (text, t) => typeButton(text, t, beans)
        },
        {
            title: '解释',
            dataIndex: 'comment',
            render: (text) => <div dangerouslySetInnerHTML={{ __html: text }}></div>
        },
        {
            title: '示例值',
            dataIndex: 'example',
            width: 300,
            align: 'left',
            fixed: 'right',
            onCell: record => ({
                record,
                editable: true,
                dataIndex: 'example',
                title: '示例值',
                handleSave,
                addRecord
            })
        },
        {
            title: '是否必须',
            dataIndex: 'required',
            width: 100,
            fixed: 'right',
            render: (text) => text ? '是' : '否'
        }
    ];

    /**定义状态Hook */
    const [visible, setVisible] = useState(false);
    const [response, setResponse] = useState(null);
    const [urlPath, setUrlPath] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState(datas);
    const [redioValue, setRedioValue] = useState(1);

    const onChangeRedioValue = e => setRedioValue(e.target.value);
    /**根据Hook创建事件函数 */
    const showDrawer = (response, urlPath) => {
        setResponse(response);
        setVisible(true);
        setUrlPath(urlPath);
    };
    const onClose = () => setVisible(false);
    const onChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const handleSave = (row, dataIndex) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        item[dataIndex] = row[dataIndex];//直接修改可变对象，不用再浅复制了
        setDataSource(newData);
    };

    const addRecord = (newRecord, newIndex) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => newRecord.key === item.key);
        newData.splice(index + newIndex, 0, newRecord);
        setDataSource(newData);
    };

    const rowSelection = { selectedRowKeys, onChange };
    const components = {
        body: {
            cell: EditableCell
        }
    };

    return (
        <div id='params-or-returns-table-div'>
            <div style={{ margin: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <Table title={() => <PostManButton selectedRows={selectedRows} {...otherProps} showDrawer={showDrawer} />}
                    rowKey={(t, index) => {
                        /**在渲染时，改变record，为它增加Key，为了实现可编辑（编辑后替换）功能。*/
                        t.key = `${t.name}-${index}`; return t.key;
                    }}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    defaultExpandAllRows
                    scroll={{ y: 'max-content', x: 1300 }}
                    pagination={false} columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
                <Drawer
                    title={<>
                        <label><b>Reponse Body&nbsp;</b></label>&nbsp;&nbsp;&nbsp;
                        <Radio.Group onChange={onChangeRedioValue} value={redioValue}>
                            <Radio value={1}>Pretty</Radio>
                            <Radio value={2}>Raw</Radio>
                        </Radio.Group>
                        <Tooltip placement="right" title={urlPath}>{urlPath}</Tooltip>
                    </>}
                    placement="left"
                    closable={true}
                    onClose={onClose}
                    visible={visible}
                    width={'61.8vw'}
                >
                    {redioValue === 1 ? <ReactJson iconStyle='square' src={JSON.parse(response)} /> : <p>{response}</p>}
                </Drawer>
            </div>
        </div>
    );
}
