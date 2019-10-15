import React from 'react';
import { Layout, Menu, Affix, Icon, Badge, Tag } from 'antd';
import { generalFetch as Fetch } from '../util/Utils'
import DocInfo from "./DocInfo";
import ClassDocInfo from "./ClassDocInfo";
import '../css/layout.css';
import 'antd/dist/antd.css';

const { Sider, Content, Header } = Layout;
const { SubMenu } = Menu;

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.docurl = document.querySelector('#docurl').textContent;
  }

  state = {
    data: {},
    collapsed: false,
    activeKey: 0
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getClassDocInfo = ({ key, domEvent }) => {
    // domEvent.preventDefault();
    this.setState({ currentClassDocInfo: this.state.data.classes[key]});
  };

  onClickMenuItem = ({ domEvent }) => {
    // domEvent.preventDefault();为了触发链接跳转，不再阻止事件默认行为
    this.setState({ currentClassDocInfo: this.state.data.classes[domEvent.target.id] ,activeKey: domEvent.target.getAttribute("data-i") });
  };

  setActiveKey = (activeKey)=>{
    this.setState({activeKey});
  }

  componentDidMount() {
    Fetch(this.docurl, {}, data => this.setState({ data }));
  }

  render() {
    const { data: { beans = [], classes = [], url, ...other }, currentClassDocInfo, activeKey } = this.state;
    const siderWidth = '17.8vw';
    const contentLayoutMarginLeft = this.state.collapsed?80:siderWidth;
    return (
      <Layout id="components-layout-smalldoc-custom-trigger" style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}
          width={siderWidth}
          style={{ overflow: 'auto' ,height:'100vh',position:'fixed'}}>
          <div className="logo" />
            <Menu theme='dark' mode="inline" onClick={this.onClickMenuItem}>
              {
                classes.map((classDocInfo, index) => {
                  return (
                    <SubMenu
                      onTitleClick={this.getClassDocInfo}
                      key={index}
                      title={
                        <span>
                          <Icon type="link" />
                          <span>{classDocInfo.comment}</span>
                        </span>
                      }
                    >
                      {
                        classDocInfo.methods.map(({ comment, name }, i) => (
                          <Menu.Item key={`${index}-${i}`}>
                            <a id={index} data-i={i} href={`#${classDocInfo.name}-${name}`}>{comment}</a><br />
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  )
                })
              }
            </Menu>
        </Sider>
        <Layout style={{ marginLeft: contentLayoutMarginLeft }}>
          <Affix offsetTop={0}>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <Badge dot>
                <Icon style={{ fontSize: 20 }} rotate={-10} type="notification" />
              </Badge>
              <span style={{ marginLeft: '20px' }}>
                文档由<Tag color="red" style={{ margin: 0 }} >smalldoc</Tag>提供支持
              </span>
              <a style={{ marginLeft: '20px' }} href={other.support}>{other.support}</a>
            </Header>
          </Affix>
          <Content style={{ margin: '20px 10px 0px 10px' }}>
            <div style={{ padding: 50, background: '#fff' }}>
              {
                currentClassDocInfo ? <ClassDocInfo {...{ currentClassDocInfo, beans, url, activeKey}} setActiveKey={this.setActiveKey} /> : <DocInfo {...{ url, other }} />
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;