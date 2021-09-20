import React from "react";
import { Menu, Icon, Layout } from "antd";
import { BrowserRouter as Route, Link, withRouter } from "react-router-dom";
import { FaUsers, FaRedRiver,FaUserMd,FaMapMarkerAlt,FaTripadvisor } from "react-icons/fa";

import main from "../../../image/logo.png";
import "../../../scss/template.scss";
import "./Silider.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

class AdminSider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      change: 1,
    };
  }
  render() {
    return (
      <div>
        <Sider
          style={{ overflow: "auto", height: "100vh", left: 0 }}
          className="d-none d-sm-none d-lg-block d-xl-block d-xxl-block template_sider bg-gradient-primary"
          trigger={null}
          collapsible
          collapsed={this.props.update_collapsed}
        >
          <div className="logo">
            <img
              src={main}
              alt={"transportcare"}
              onClick={() => {
                this.props.history.push("/admin/admin-dashboard");
              }}
              className="w-75 object_fit cursor_point"
            />
          </div>
          <Menu
            theme="dark"
            selectedKeys={[this.props.location.pathname]}
            mode="inline"
          >
            <h3 className="sidebarTitle">Dashboard</h3>
            <Menu.Item key="/admin/admin-dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
              <Link to="/admin/admin-dashboard" />
            </Menu.Item>
            <Menu.Item key="/admin/admin-user">
            <FaUsers style={{ fontSize: '1.2em' }} />
              <span style={{margin:10}}>Users</span>
              <Link to="/admin/admin-user" />
            </Menu.Item>
            <Menu.Item key="/admin/admin-driver">
            <FaRedRiver style={{ fontSize: '1.2em' }} />
            <span style={{margin:10}}>Drivers</span>
              <Link to="/admin/admin-driver" />
            </Menu.Item>
            <Menu.Item key="/admin/admin-caregiver">
            <FaUserMd style={{ fontSize: '1.2em' }} />
            <span style={{margin:10}}>Caregivers</span>
              <Link to="/admin/admin-caregiver" />
            </Menu.Item>
            <h3 className="sidebarTitle">Quick Menu</h3>
            <Menu.Item key="/admin/admin-category">
              <Icon type="deployment-unit" />
              <span>Categories</span>
              <Link to="/admin/admin-category" />
            </Menu.Item>            
            <Menu.Item key="/admin-location">
              <FaMapMarkerAlt style={{ fontSize: '1.2em' }} />
              <span style={{margin:10}}>Driver Map</span>
              <Link to="/admin/admin-location" />
            </Menu.Item>
            <h3 className="sidebarTitle">Notifications</h3>
            <Menu.Item key="/admin-booking">
              <FaTripadvisor style={{ fontSize: '1.2em' }} />
              <span style={{margin:10}}>Trip</span>
              <Link to="/admin/admin-booking" />
            </Menu.Item>
            <Menu.Item key="/admin-review">
              <Icon type="star" />
              <span>Reviews</span>
              <Link to="/admin/admin-review" />
            </Menu.Item>
            <h3 className="sidebarTitle">Settings</h3>
            <Menu.Item key="/admin/admin-static">
              <Icon type="book" />
              <span>Static Pages</span>
              <Link to="/admin/admin-static" />
            </Menu.Item>
          </Menu>
        </Sider>
      </div>
    );
  }
}
export default withRouter(AdminSider);
