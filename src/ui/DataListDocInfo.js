import React from 'react';
import { Button, Table, message } from 'antd';

const warning = (qtype) => {
  message.warning('这是一个复杂对象：' + qtype);
};

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

const typeButton = (text, t, beans) => {
  return <span id='type-button'>
    {beans[t.qtype] ? <Button type='link' onClick={() => warning(t.qtype)}>{text}</Button> : text}
    {parseTypeArguments(t, beans)}
  </span>
}

export default ({ datas, beans, isReturn }) => {
  /**
   * 绑定Bean字段，只解析两级，如果想全部解析，请使用“递归”。
   */
  datas && datas.forEach(t => {
    t.hierarchy = 1;
    const fields = beans[t.qtype];
    if (fields) {
      t.children = fields;
      fields.forEach(f => {
        f.hierarchy = 2;
        const ffields = beans[f.qtype];
        if (ffields)
          f.children = ffields;
      })
    }
  })

  const columns = [
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

  if (!isReturn)
    columns.push({
      title: '是否必须',
      dataIndex: 'required',
      width: 100,
      key: 'required',
      fixed: 'right'
    });

  return (
    <div id='params-or-returns-table-div'>
      <div style={{ margin: 10, backgroundColor: `#fff`, border: `1px solid #e5eecc` }}>
        <Table title={() => <b>{isReturn ? '返回结果:' : '请求参数:'}</b>} rowKey={(t) => t.qtype + t.name + t.hierarchy}
          defaultExpandAllRows
          scroll={{ y: 300, x: 1300 }}
          pagination={false} columns={columns} dataSource={datas} />
      </div>
    </div>
  );
}