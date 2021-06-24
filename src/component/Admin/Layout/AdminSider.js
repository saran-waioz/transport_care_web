import React from "react";
import { Menu, Icon, Layout } from "antd";
import { BrowserRouter as Route, Link, withRouter } from "react-router-dom";
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
                this.props.history.push("/admin-dashboard");
              }}
              className="w-75 object_fit cursor_point"
            />
          </div>
          <Menu
            theme="dark"
            selectedKeys={[this.props.location.pathname]}
            mode="inline"
          >
            <div className="sidebar">
              <div className="sidebarWrapper">
                <div className="sidebarMenu">
                  <h3 className="sidebarTitle">Dashboard</h3>
                  <ul className="sidebarList">
                    <Link to="/admin-dashboard" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                       <span>Dashboard</span> 
                      </li>
                    </Link>
                    <Link to="/admin-user" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Users
                      </li>
                    </Link>
                    <Link to="/admin-driver" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Drivers
                      </li>
                    </Link>
                    <Link to="/admin-caregiver" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Caregivers
                      </li>
                    </Link>
                  </ul>
                </div>
                <div className="sidebarMenu">
                  <h3 className="sidebarTitle">Quick Menu</h3>
                  <ul className="sidebarList">
                    <Link to="/admin-category" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Categories
                      </li>
                    </Link>
                    <Link to="/admin-booking" className="link">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Trip
                      </li>
                    </Link>
                    <Link>
                      <li className="side_list" style={{ padding: "20px" }}>
                        Payout
                      </li>
                    </Link>
                  </ul>
                </div>
                <div className="sidebarMenu">
                  <h3 className="sidebarTitle">Notifications</h3>
                  <ul className="sidebarList">
                    <Link to="/admin-location">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Driver Map
                      </li>
                    </Link>
                    <Link to="/admin-static">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Static Pages
                      </li>
                    </Link>
                    <Link to="/settings">
                      <li className="side_list" style={{ padding: "20px" }}>
                        Settings
                      </li>
                    </Link>
                  </ul>
                </div>
                {/* <div className="sidebarMenu">
                  <h3 className="sidebarTitle">Staff</h3>
                  <ul className="sidebarList">
                    <li className="side_list" style={{ padding: "20px" }}>
                      Home
                    </li>
                    <li className="side_list" style={{ padding: "20px" }}>
                      Home
                    </li>
                    <li className="side_list" style={{ padding: "20px" }}>
                      Home
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
          </Menu>
        </Sider>
      </div>
    );
  }
}
export default withRouter(AdminSider);
