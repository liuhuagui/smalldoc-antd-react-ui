import React from 'react';
import { Collapse, Descriptions, BackTop, Tag, Icon } from 'antd';
import MethodDocInfo from './MethodDocInfo';


const { Panel } = Collapse;
const panelHeaderStyle = { display: 'inline-block', whiteSpace: 'nowrap', width: '17.8vw', overflow: 'hidden', texOverflow: 'ellipsis', padding: '12px 16px' };

class ClassDocInfo extends React.Component {

  render() {
    const { currentClassDocInfo: { authors, methods, ...other }, beans, url, activeKey, setActiveKey } = this.props;
    return (
      <div className="class-doc-info">
        <Descriptions title={`${other.comment}（${other.name}）`} column={2}>
          <Descriptions.Item label="作者">
            {
              authors.map((v, i) => {
                let color = (i & 1) === 1 ? 'purple' : 'geekblue';
                return <Tag color={color} key={i}>{v}</Tag>
              })
            }
          </Descriptions.Item>
        </Descriptions>
        <div id="components-back-top-smalldoc-custom">
          <BackTop>
            <div className="ant-back-top-inner">TOP</div>
          </BackTop>
        </div>
        <Collapse activeKey={[activeKey]}>
          {
            methods.map((methodDocInfo, index) => (
              //由于Panel没有onClick，使用ReactNode header的onClick解决，但是header的作用范围太小，
              //默认的expandIcon无法被header的onClick覆盖，容易产生误导，所以禁用系统的expandIcon，在header中自定义。
              <Panel header={<div style={panelHeaderStyle} onClick={() => setActiveKey(index == activeKey ? ++index : index)}><Icon type={activeKey == index ? 'down' : 'right'} />&nbsp;{methodDocInfo.comment}</div>}
                id={`${other.name}-${methodDocInfo.name}`} key={index} showArrow={false}>
                <MethodDocInfo  {...{ methodDocInfo, beans, url }} />
              </Panel>
            ))
          }
        </Collapse>
      </div>
    );
  }
}

export default ClassDocInfo;