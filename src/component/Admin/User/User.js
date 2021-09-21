import React from "react";
import "antd/dist/antd.css";
import "../../../scss/template.scss";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import { Layout,Tabs } from "antd";
import UserTable from "./User_Table";
const { Content } = Layout;
const { TabPane } = Tabs;
class User extends React.Component {
  state = {
    collapsed: false,
  };
  onToggle = (val) => {
    console.log(val);
    this.setState({
      collapsed: val,
    });
  };
  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <AdminSider update_collapsed={this.state.collapsed} />
        <Layout>
          <AdminHeader />
          <Content className="main_frame">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Current User" key="1">
                <UserTable />
              </TabPane>
              
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default User;
