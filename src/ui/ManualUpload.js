import React from "react";
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default class ManualUpload extends React.Component {
    state = {
        fileList: [],
        uploading: false,
    };

    render() {
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                const fileList = [...this.state.fileList, file];
                const { record, dataIndex } = this.props;
                record[dataIndex] = fileList;//直接修改可变对象，不用再浅复制了
                this.setState(state => ({
                    fileList
                }));
                return false;
            },
            fileList,
        };

        return (
            <Upload {...props}>
                <Button loading={uploading}>
                    <UploadOutlined /> {uploading ? 'Uploading' : 'Select File'}
                </Button>
            </Upload>
        );
    }
}