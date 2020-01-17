import React, { useState, useEffect, useRef } from 'react';
import { Table, Drawer } from 'antd';
import PostManButton from './PostManButton';
import { typeButton } from "../util/Utils";
import EditableCell from "./EditableCell";
import "../css/editable.css";

/**
 * 可写属性，必要时需要做Copy，防止数据被污染
 */
export default ({ datas, beans, tableId, ...otherProps }) => {
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
                onUp
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [jsonForm, setJsonForm] = useState({});
    const [dataSource, setDataSource] = useState(datas);

    /**根据Hook创建事件函数 */
    const showDrawer = (response) => {
        setResponse(response);
        setVisible(true)
    };
    const onClose = () => setVisible(false);
    const onChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    };

    const handleSave = (row, dataIndex) => {
        console.log(row);
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        item[dataIndex] = row[dataIndex];
        setDataSource(newData);
    };
    const rowSelection = { selectedRowKeys, onChange };
    const components = {
        body: {
            cell: EditableCell
        }
    };

    const [rowKeyObject, setRowKeyObject] = useState({});
    const onUp = (rowKey) => setRowKeyObject({ rowKey });
    useEffect(() => {
        const { rowKey } = rowKeyObject
        if (!rowKey)
            return;
        console.log(rowKey);
        const scrollDiv = document.querySelector(`#${tableId} .ant-table-scroll > .ant-table-body`);
        const leftFixedDiv = document.querySelector(`#${tableId} .ant-table-fixed-left .ant-table-body-inner`);
        const rightFixedDiv = document.querySelector(`#${tableId} .ant-table-fixed-right .ant-table-body-inner`);

        const cssSelector = `table.ant-table-fixed tr[data-row-key='${rowKey}']`;
        const rightFixedTr = rightFixedDiv.querySelector(cssSelector);
        const leftFixedTr = leftFixedDiv.querySelector(cssSelector);
        const scrollTr = scrollDiv.querySelector(cssSelector);

        const theoryTrHeight = getComputedStyle(rightFixedTr).height;

        scrollTr.style.height = theoryTrHeight;
        leftFixedTr.style.height = theoryTrHeight;
        console.log(scrollTr.style.height)
        console.log(leftFixedTr.style.height)
        console.log("-------")
    });

    return (
        <div id='params-or-returns-table-div'>
            <div style={{ margin: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <Table id={tableId} title={() => <PostManButton {...otherProps} showDrawer={showDrawer} />}
                    rowKey={(t, index) => {
                        /**在渲染时，改变record，为它增加Key，为了实现可编辑（编辑后替换）功能。*/
                        t.key = `${t.name}-${index}`; return t.key;
                    }}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    defaultExpandAllRows
                    scroll={{ y: 400, x: 1300 }}
                    pagination={false} columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
                <Drawer
                    title="Reponse Body"
                    placement="left"
                    closable={true}
                    onClose={onClose}
                    visible={visible}
                    width={'61.8vw'}
                >
                    <p>{response}</p>
                </Drawer>
            </div>
        </div>
    );
}
