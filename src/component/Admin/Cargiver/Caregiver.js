import React from "react";
import "antd/dist/antd.css";
import "antd/dist/antd.css";
import "../../../scss/template.scss";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import { Layout } from "antd";
import UserTable from "./Caregiver_table";
const { Content } = Layout;
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
            <UserTable />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Caregiver;
