import React, { useState } from 'react';
import { Button, Table, message, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

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
 * 递归解析返回参数
 * @param {*} fields 
 * @param {*} hierarchy 
 * @param {*} beans 
 * @param {String} ownerType 字段拥有者的类型，作为参考，解决循环引用造成的递归问题
 */
const parseReturnArguments = (fields, hierarchy, beans, ownerType) => {
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
    return (
      <div id='params-or-returns-table-div'>
        <div style={{ margin: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <Table title={() => <b>{isReturn ? '返回结果:' : '请求参数:'}</b>} rowKey={(t) => t.qtype + t.name + t.hierarchy}
            defaultExpandAllRows
            scroll={{ y: 'max-content', x: 1300 }}
            pagination={false} columns={columns} dataSource={datas} />
        </div>
      </div>
    );
  } else {
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const options = datas.map(record => record.name);

    const onChange = checkedList => {
      // console.log(checkedList);
      setCheckedList(checkedList);
      setIndeterminate(!!checkedList.length && checkedList.length < options.length);
      setCheckAll(checkedList.length === options.length);
    };

    const onCheckAllChange = e => {
      console.log(e.target.checked);
      console.log(options);
      setCheckedList(['a', 'b']);
      setIndeterminate(true);
      setCheckAll(e.target.checked);
    };
    console.log(checkedList)
    columns.push({
      title: <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>示例值</Checkbox>,
      dataIndex: 'example',
      width: 300,
      align: 'left',
      fixed: 'right',
      render: (text, record, index) => <Checkbox value={record.name}>{record.name}</Checkbox>
    },
      {
        title: '是否必须',
        dataIndex: 'required',
        width: 100,
        fixed: 'right',
        render: (text) => text ? '是' : '否'
      });
    return (
      <div id='params-or-returns-table-div'>
        <div style={{ margin: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <CheckboxGroup value={checkedList} onChange={onChange}>
            <Table title={() => <b>{isReturn ? '返回结果:' : '请求参数:'}</b>} rowKey={(t) => t.qtype + t.name + t.hierarchy}
              defaultExpandAllRows
              scroll={{ y: 'max-content', x: 1300 }}
              pagination={false} columns={columns} dataSource={datas} />
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}
