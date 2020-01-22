import React from 'react';
import { Descriptions, Tag, Switch, Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from "@ant-design/icons";
import MyTag from './MyTag'
import ReturnsTable from './ReturnsTable';
import ParamsTable from './ParamsTable';


class MethodDocInfo extends React.Component {
  state = {
    part: true
  };

  onPart = () => {
    this.setState({ part: !this.state.part });
  };

  onChangeUrlPath = (urlPath) => {
    this.setState({ urlPath });
  }

  onChangeUrlMehod = (urlMethod) => {
    this.setState({ urlMethod });
  }

  static getDerivedStateFromProps(props, state) {
    const { url, methodDocInfo: { mapping: { path, method } } } = props;
    const { urlPath, urlMethod } = state;
    if (!urlPath && !urlMethod)
      return { urlPath: url + path[0], urlMethod: method[0] };
    return null;
  }

  render() {
    const { methodDocInfo, beans, url} = this.props;
    const { params, returns, mapping: { path, method, produces, consumes }, authors } = methodDocInfo;
    const { part, urlPath, urlMethod } = this.state;
    return (<div>
      <Descriptions title={<div dangerouslySetInnerHTML={{ __html: methodDocInfo.comment }}></div>} column={1}>
        <Descriptions.Item label="接口地址">
          <MyTag.Group value={urlPath} onChange={this.onChangeUrlPath}>
            {
              path.map((v, i) => {
                const wholePath = url + v;
                const urlPath0 = part ? v : wholePath;
                return <span key={i}>
                  <MyTag value={wholePath} color="green">{urlPath0}</MyTag>
                  <CopyToClipboard text={urlPath0} onCopy={() => this.setState({ copied: true })}>
                    <Button size='small' icon={<CopyOutlined />} style={{ marginRight: 15 }} />
                  </CopyToClipboard>
                </span>
              })
            }
          </MyTag.Group>
          <Switch defaultChecked onChange={this.onPart} />
        </Descriptions.Item>
        <Descriptions.Item label="请求方式">
          <MyTag.Group value={urlMethod} onChange={this.onChangeUrlMehod}>
            {
              method.map((v, i) => {
                let color = (i & 1) === 1 ? 'magenta' : 'gold';
                return <MyTag value={v} color={color} key={i}>{v}</MyTag>
              })
            }
          </MyTag.Group>
        </Descriptions.Item>
        <Descriptions.Item label="响应类型">
          {
            produces.map((v, i) => {
              let color = (i & 1) === 1 ? 'magenta' : 'gold';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
        <Descriptions.Item label="请求类型">
          {
            consumes.map((v, i) => {
              let color = (i & 1) === 1 ? 'magenta' : 'gold';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
        <Descriptions.Item label="作者">
          {
            authors.map((v, i) => {
              let color = (i & 1) === 1 ? 'purple' : 'geekblue';
              return <Tag color={color} key={i}>{v}</Tag>
            })
          }
        </Descriptions.Item>
      </Descriptions>
      <ParamsTable datas={params} {...{ beans, urlPath, urlMethod}} />
      <ReturnsTable datas={[returns]} beans={beans} />
    </div>);
  }
}

export default MethodDocInfo;