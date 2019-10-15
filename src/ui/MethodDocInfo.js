import React from 'react';
import { Descriptions, Tag, Switch, Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DataListDocInfo from './DataListDocInfo';

class MethodDocInfo extends React.Component {

  state = {
    part: true
  };

  onPart = () => {
    this.setState({ part: !this.state.part });
  };


  render() {
    const { methodDocInfo, beans, url } = this.props;
    const { params, returns } = methodDocInfo;
    return (<div>
      <Descriptions title={<div dangerouslySetInnerHTML={{ __html: methodDocInfo.comment }}></div>} column={1}>
        <Descriptions.Item label="接口地址">
          {
            methodDocInfo.mapping.path.map((v, i) => {
              const urlPath = this.state.part ? v : url + v;
              return <span key={i}>
                <Tag color="green">{urlPath}</Tag>
                <CopyToClipboard text={urlPath} onCopy={() => this.setState({ copied: true })}>
                  <Button size='small' icon="copy" style={{ marginRight: 15 }} />
                </CopyToClipboard>
                </span>
            })
          }
          <Switch defaultChecked onChange={this.onPart} />
        </Descriptions.Item>
        <Descriptions.Item label="请求方式">
          {
            methodDocInfo.mapping.method.map((v, i) => {
              let color = (i & 1) === 1 ? 'magenta' : 'gold';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
        <Descriptions.Item label="响应类型">
          {
            methodDocInfo.mapping.produces.map((v, i) => {
              let color = (i & 1) === 1 ? 'magenta' : 'gold';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
        <Descriptions.Item label="请求类型">
          {
            methodDocInfo.mapping.consumes.map((v, i) => {
              let color = (i & 1) === 1 ? 'magenta' : 'gold';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
        <Descriptions.Item label="作者">
          {
            methodDocInfo.authors.map((v, i) => {
              let color = (i & 1) === 1 ? 'purple' : 'geekblue';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
      </Descriptions>
      <DataListDocInfo  datas={params} {...{beans}} />
      <DataListDocInfo  datas={[returns]} isReturn  {...{beans}} /> 
    </div>);
  }
}

export default MethodDocInfo;