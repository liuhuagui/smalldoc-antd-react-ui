import React from 'react';
import { Collapse, Descriptions, BackTop, Tag } from 'antd';
import MethodDocInfo from './MethodDocInfo';
import { colorClasses } from '../util/Constants'
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const divisor = colorClasses.length;

class ClassDocInfo extends React.Component {

  render() {
    const { currentClassDocInfo: { authors, methods, ...other }, beans, url, activeKey, setActiveKey } = this.props;
    return (
      <div className="class-doc-info">
        <Descriptions title={<div dangerouslySetInnerHTML={{ __html: `${other.comment}（${other.name}）` }}></div>} column={2}>
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
        <Collapse activeKey={[activeKey]} >
          {
            methods.map((methodDocInfo, index) => {
              const classKeyPairs = colorClasses[index % divisor];
              return (
                //由于Panel没有onClick，使用ReactNode header的onClick解决，但是header的作用范围太小，
                //默认的expandIcon无法被header的onClick覆盖，容易产生误导，所以禁用系统的expandIcon，在header中自定义。
                <Panel header={<div className={classKeyPairs[0]} onClick={() => setActiveKey(index === activeKey ? ++index : index)}>
                  <div className={classKeyPairs[1]}>{activeKey === index ? <DownOutlined /> : <RightOutlined />}&nbsp;{methodDocInfo.comment}</div>
                </div>}
                  id={`${other.name}-${methodDocInfo.name}`} key={index} showArrow={false}>
                  {/* 这个Key是为了‘reset’状态 */}
                  <MethodDocInfo  key={methodDocInfo.name + index} {...{ methodDocInfo, beans, url }} />
                </Panel>
              );
            })
          }
        </Collapse>
      </div>
    );
  }
}

export default ClassDocInfo;