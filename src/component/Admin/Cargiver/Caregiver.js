import React from "react";
import "antd/dist/antd.css";
import "antd/dist/antd.css";
import "../../../scss/template.scss";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import { Layout,Tabs } from "antd";
import UserTable from "./Caregiver_table";
const { Content } = Layout;
const { TabPane } = Tabs;

class Caregiver extends React.Component {
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
              <TabPane tab="Deleted User" key="2">
                <UserTable tab_option="delete_user" />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Caregiver;
