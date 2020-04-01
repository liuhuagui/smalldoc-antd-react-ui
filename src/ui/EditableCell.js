import React from "react";
import { Input, Button, Select } from 'antd';
import ManualUpload from "./ManualUpload";
import { arrayTag } from "../util/Constants";
import PlusOutlined from "@ant-design/icons/PlusOutlined";



export default class EditableCell extends React.Component {
    state = {
        editing: false,
        key: 0
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                if (this.input.focus instanceof Function)
                    this.input.focus();
            }
        });
    };

    inputSave = () => {
        const { record, handleSave, dataIndex } = this.props;
        this.toggleEdit();
        handleSave({ ...record, [dataIndex]: this.input.props.value }, dataIndex);
    };

    selectSave = () => {
        const { record, handleSave, dataIndex } = this.props;
        this.toggleEdit();
        const { value } = this.state;
        const newRecord = { ...record };
        value && (newRecord[dataIndex] = value.map(v => v.label));
        handleSave(newRecord, dataIndex);
    };


    index = 0;
    addNewRecord = (e) => {
        e.stopPropagation();
        const { record, addRecord } = this.props;
        const newRecord = { ...record };
        newRecord.name = newRecord.name.replace(arrayTag, `[${++this.index}]`)
        addRecord(newRecord, this.index);
    }

    onInputChange = e => {
        this.setState({ value: e.target.value });
    }

    onSelectChange = (value) => {
        if (value.length === 0) {
            this.setState({ value, key: 0 });
            return;
        }
        const selectValue = value[value.length - 1];
        const key = this.state.key + 1;
        selectValue.key = key;
        delete selectValue.value;//为了Select组件实现重复值
        this.setState({ value, key });
    }

    nodeRefCallback = node => (this.input = node);

    renderCell = () => {
        const { children, record, dataIndex } = this.props;
        const { editing, value } = this.state;

        if (record.file)
            return <ManualUpload {...{ record, dataIndex }} ref={this.nodeRefCallback} />

        let initValue = children[1];
        const includeArrayTag = record.name.includes(arrayTag);
        if (!editing)
            return (<div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24, display: 'flex', justifyContent: 'space-between' }}
                onClick={this.toggleEdit}
            >
                {children[1] && children[1].toString()}
                {includeArrayTag && <Button className='forward-visiable-button' onClick={this.addNewRecord} icon={<PlusOutlined />} type='primay' />}
            </div>);

        if (includeArrayTag) {
            return <Input addonAfter={<Button className='back-addon-after-button' icon={<PlusOutlined />} type='primay' />} ref={this.nodeRefCallback} value={value ? value : initValue} onChange={this.onInputChange} onPressEnter={this.inputSave} onBlur={this.inputSave} />;
        }

        if (record.dimension) {
            initValue = Array.isArray(initValue) ? initValue.map((v, i) => ({ key: i, label: v })) : [{ key: 0, label: initValue }];
            return <Select allowClear ref={this.nodeRefCallback} mode="tags"
                open={false}
                value={value ? value : initValue}
                style={{ width: '100%' }}
                optionLabelProp={'label'}
                labelInValue={true}
                tokenSeparators={[',']}
                placeholder={'To split with ,'}
                onChange={this.onSelectChange}
                onBlur={this.selectSave}
            >
            </Select>;
        }

        return <Input ref={this.nodeRefCallback} value={value ? value : initValue} onChange={this.onInputChange} onPressEnter={this.inputSave} onBlur={this.inputSave} />;
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            addRecord,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}  >
                {editable ? this.renderCell() : children}
            </td>
        );
    }
}