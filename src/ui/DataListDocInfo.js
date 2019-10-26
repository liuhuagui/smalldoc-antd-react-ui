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

const parseReturnArguments = (args, hierarchy, beans) => {
  args.forEach(arg => {
    arg.hierarchy = hierarchy++;
    //1. 首先根据完全限定名解析Bean，可能是普通bean也可能是包含简单TypeVariable字段的bean。
    let fields = beans[arg.qtype];
    let typeArguments;
    //2. 否则，判断是否拥有类型参数。
    if (!fields && (typeArguments = arg.typeArguments)) {
      //3. 如果拥有单个类型参数，尝试解析该参数，比如："java.util.List<T>"
      fields = typeArguments.length === 1 ? beans[typeArguments[0].qtype] : false
    }
    if (!fields)
      return;
    //防止污染beans，做深copy
    const fields_copy = JSON.parse(JSON.stringify(fields));
    arg.children = fields_copy;
    parseReturnArguments(fields_copy, hierarchy, beans)
  });
}

export default ({ datas, beans, isReturn }) => {
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

  if (isReturn) {
    datas && parseReturnArguments(datas, 1, beans);
  } else {
    columns.push({
      title: '是否必须',
      dataIndex: 'required',
      width: 100,
      fixed: 'right',
      render: (text) => text ? '是' : '否'
    });
    console.log(datas)
  }


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