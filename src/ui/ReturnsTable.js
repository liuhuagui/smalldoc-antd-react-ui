import React from 'react';
import { Table } from 'antd';
import {parseReturnArguments,typeButton} from "../util/Utils";

/**
 * 只读属性，不用担心数据被污染
 */
export default ({ datas, beans }) => {
    let columns = [
        {
            title: '参数名称',
            dataIndex: 'name',
            width: 250,
            fixed: 'left',
            render: (text, t) => t.children ? <del>{text}</del> : text
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
        }
    ];
    datas && parseReturnArguments(datas, 1, beans);

    return (
        <div id='params-or-returns-table-div'>
            <div style={{ margin: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <Table title={() => <b>返回结果:</b>} rowKey={(t) => t.qtype + t.name + t.hierarchy}
                    defaultExpandAllRows
                    scroll={{ y: 'max-content', x: 1300 }}
                    pagination={false} columns={columns} dataSource={datas} />
            </div>
        </div>
    );
}
