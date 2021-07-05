
import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon, Typography } from 'antd';
import '../../scss/template.scss';
const { Text } = Typography;
const { Sider } = Layout;
class TemplateSider extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <Sider style={{ overflow: 'auto', height: '100vh', left: 0, }} className="d-none d-sm-none d-lg-block d-xl-block d-xxl-block template_sider" trigger={null} collapsible collapsed={this.props.update_collapsed}>
        <div className="logo">
          Essity
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Icon type="dashboard" style={{ fontSize: 25 }} />
            <Text strong>Dashboard</Text>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="user" />
            <span>User</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>Booking</span>
          </Menu.Item>
        </Menu>
      </Sider>

    );
  }
}

export default TemplateSider;
