import React from "react";
import { Menu, Icon, Layout } from "antd";
import { BrowserRouter as Route, Link, withRouter } from "react-router-dom";
import { FaUsers, FaRedRiver,FaUserMd,FaMapMarkerAlt,FaTripadvisor } from "react-icons/fa";
import { Drawer, Button, Select } from "antd";
import main from "../../../image/logo.png";
import "../../../scss/template.scss";
import "./Silider.css";
const { Option } = Select;

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const icon_style = {
      fontSize: "2.5em",
      color: "white",
    };
    return (
      <div>
        <Icon
          type="menu-unfold"
          className="d-inline d-md-none"
          style={icon_style}
          onClick={this.showDrawer}
        />
        <Drawer
          width={200}
          onClose={this.onClose}
          visible={this.state.visible}
          closable={false}
          placement="left"
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
            <Menu.Item key="/admin-request">
              <Icon type="appstore" />
              <span>Job Request</span>
              {/* <Link to="/admin-request" /> */}
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
              {/* <Link to="/admin-review" /> */}
            </Menu.Item>
            <Menu.Item key="/admin-payouts">
              <Icon type="transaction" />
              <span>Payouts</span>
              {/* <Link to="/admin-payouts" /> */}
            </Menu.Item>
            <h3 className="sidebarTitle">Settings</h3>
            <Menu.Item key="/admin/admin-certificate">
              <Icon type="file-unknown" />
              <span>Certificates</span>
              {/* <Link to="/admin-certificate" /> */}
            </Menu.Item>
            <Menu.Item key="/admin/admin-static">
              <Icon type="book" />
              <span>Static Pages</span>
              <Link to="/admin/admin-static" />
            </Menu.Item>
            <Menu.Item key="/admin/settings">
              <Icon type="setting" />
              <span>Settings</span>
              <Link to="/admin/settings" />
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(DrawerForm);
