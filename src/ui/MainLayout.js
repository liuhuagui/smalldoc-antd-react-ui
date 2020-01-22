import React from 'react';
import { Layout, Menu, Affix, Badge, Tag, Select, Tooltip } from 'antd';
import DocInfo from "./DocInfo";
import ClassDocInfo from "./ClassDocInfo";
import { LinkOutlined, MenuUnfoldOutlined, MenuFoldOutlined, NotificationOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../css/layout.css';


const { Sider, Content, Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},//JSON.parse(document.querySelector('#docJSON').value),
      collapsed: false,
      activeKey: 0,
      packageArray: [],
      classes: [],
      selected: ''
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getClassDocInfo = ({ key, domEvent }) => {
    // domEvent.preventDefault();
    this.setState({ currentClassDocInfo: this.state.classes[key], activeKey: 0 });
  };

  onClickMenuItem = ({ domEvent }) => {
    // domEvent.preventDefault();为了触发链接跳转，不再阻止事件默认行为
    this.setState({ currentClassDocInfo: this.state.classes[domEvent.target.id], activeKey: Number.parseInt(domEvent.target.getAttribute("data-i")) });
  };

  setActiveKey = (activeKey) => {
    this.setState({ activeKey });
  };

  onSelectChange = (selected) => {
    const { data: { packages = {} } } = this.state;
    const { classes, packageUrl } = getClasses(packages, selected);
    this.setState({ selected, packageUrl, classes, currentClassDocInfo: classes[0], activeKey: 0 });
  };

  componentDidMount() {
    const docurl = document.querySelector('#docurl').textContent;
    fetch(docurl, {
      method: 'POST'
    }).then(response => {
      if (response.ok)
        return response.json();
      throw new Error(`Request is failed, status is ${response.status}`);
    }).then(data => {
      const { packages = {} } = data;
      const packageArray = Object.entries(packages);
      const selected = packageArray[0] ? packageArray[0][0] : '';
      this.setState({ data, packageArray, selected, ...getClasses(packages, selected) });
    }, reason => console.log(reason));
  }

  render() {
    const { data: { beans = [], url, ...other }, currentClassDocInfo, activeKey, selected, packageArray, classes, packageUrl } = this.state;
    const siderWidth = '17.8vw';
    const contentLayoutMarginLeft = this.state.collapsed ? 80 : siderWidth;
    const actualUrl = packageUrl ? packageUrl : url;

    return (
      <Layout id="components-layout-smalldoc-custom-trigger" style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}
          width={siderWidth}
          style={{ overflow: 'auto', height: '100vh', position: 'fixed' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 64, justifyContent: 'center' }} >
            <Select
              showSearch
              style={{ width: '70%' }}
              optionFilterProp="children"
              onChange={this.onSelectChange}
              value={selected}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >{
                packageArray.map(([packageName, { comment }], index) => {
                  return <Option key={index} value={packageName}><Tooltip placement="right" title={comment}>{comment}</Tooltip></Option>
                })
              }
            </Select>
          </div>
          <Menu theme='dark' mode="inline" onClick={this.onClickMenuItem}>
            {
              classes.map((classDocInfo, index) => {
                return (
                  <SubMenu
                    onTitleClick={this.getClassDocInfo}
                    key={index}
                    title={
                      <span>
                        <LinkOutlined />
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
              {
                this.state.collapsed ? <MenuUnfoldOutlined className="trigger" onClick={this.toggle} />
                  : <MenuFoldOutlined className="trigger" onClick={this.toggle} />
              }
              <Badge dot>
                <NotificationOutlined style={{ fontSize: 20 }} rotate={-10} type="notification" />
              </Badge>
              <span style={{ marginLeft: '20px' }}>
                文档由<Tag color="red" style={{ margin: 0 }} >smalldoc</Tag>提供支持
              </span>
              <a style={{ marginLeft: '20px' }} href={other.support}>{other.support}</a>
            </Header>
          </Affix>
          <Content style={{ margin: '10px 0px' }}>
            <div style={{ padding: 30, background: '#fff' }}>
              {
                currentClassDocInfo ? <ClassDocInfo {...{ currentClassDocInfo, beans, url: actualUrl, activeKey }} setActiveKey={this.setActiveKey} /> : <DocInfo {...{ url, other }} />
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;

function getClasses(packages, selected) {
  const package0 = packages[selected];
  const classes = package0 ? package0.classes : [];
  return { classes, packageUrl: package0.url };
}
