import React from 'react';
import { Descriptions } from 'antd';

class DocInfo extends React.Component {
  render() {
    const { url, other } = this.props;
    return (<Descriptions title={other.projectName} bordered column={1} style={{ background: '#fff', padding: '10px 20px' }}>
      <Descriptions.Item label="操作系统">{other.osName}</Descriptions.Item>
      <Descriptions.Item label="JDK版本">{other.jdkVersion}</Descriptions.Item>
      <Descriptions.Item label="工程编码">{other.encoding}</Descriptions.Item>
      <Descriptions.Item label="访问路径">{url}</Descriptions.Item>
      <Descriptions.Item label="源文件路径（包含子目录）">
        {
          other.sourcepath && other.sourcepath.split(";").map((v, i) => (
            v && <span key={i}>{v}<br /></span>
          ))
        }
      </Descriptions.Item>
      <Descriptions.Item label="扫描的包（包含子包）">
        {
          other.subpackages && other.subpackages.split(":").map((v, i) => (
            v && <span key={i}>{v}<br /></span>
          ))
        }
      </Descriptions.Item>
    </Descriptions>
    );
  }
}

export default DocInfo;