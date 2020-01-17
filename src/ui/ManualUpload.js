import React from "react";
import { Upload, Button, Icon } from 'antd';

export default class ManualUpload extends React.Component {
    state = {
        fileList: [],
        count: 0,
        uploading: false,
    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });
    }

    componentDidUpdate(prevprops, prevState) {
        console.log("变化开始: " + Date.now())
        console.log(prevState.fileList.length)
        console.log(prevState.count)

        if (prevState.count !== prevState.fileList.length) {
            console.log("变化进行: " + Date.now())
            this.props.onUp();
            this.setState({ count: prevState.fileList.length });
        }
        console.log("--------" + Date.now())
    }


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
                console.log(file)
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <Upload {...props}>
                <Button loading={uploading}>
                    <Icon type="upload" /> {uploading ? 'Uploading' : 'Select File'}
                </Button>
            </Upload>
        );
    }
}