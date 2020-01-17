import React from "react";
import { Input, Button, Select, Icon } from 'antd';
import ManualUpload from "./ManualUpload";

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

    onInputChange = e => {
        this.setState({ value: e.target.value });
    }

    handleChange = (value) => {
        if (value.length === 0) {
            this.setState({ value, key: 0 });
            return;
        }
        const inputValue = value[value.length - 1];
        const key = this.state.key + 1;
        inputValue.key = key;
        this.setState({ value, key });
    }

    renderCell = () => {
        const { children, dataIndex, record, title, onUp } = this.props;
        const { editing, value } = this.state;
        const initValue = record[dataIndex];
        let A = <Input ref={node => (this.input = node)} value={value ? value : initValue} onChange={this.onInputChange} onPressEnter={this.inputSave} onBlur={this.inputSave} />;
        if (record.file)
            A = <ManualUpload ref={node => (this.input = node)} onUp={() => onUp(record.key)} />
        if (record.dimension)
            A = <Select allowClear ref={node => (this.input = node)} mode="tags"
                open={false}
                value={value ? value : [{ key: 0, label: initValue }]}
                style={{ width: '100%' }}
                optionLabelProp={'label'}
                tokenSeparators={[',']}
                placeholder={'To split with ,'}
                onChange={this.handleChange}
                labelInValue={true}
                onBlur={this.selectSave}
            >
            </Select>;

        return editing ? A : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {initValue?initValue.toString():"FILE EXPECTED"}
            </div>
        );
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
            onUp,
            ...restProps
        } = this.props;
        const onEvent = editable ? { onKeyUp: () => onUp(record.key), onMouseUp: () => onUp(record.key) } : {};
        return (
            <td {...restProps}  >
                {editable ? this.renderCell() : children}
            </td>
        );
    }
}