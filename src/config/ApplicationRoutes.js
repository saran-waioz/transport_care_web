import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import UserList from "./components/pages/UserList";
import User from "./components/pages/User";
import DriverList from "./components/pages/DriverList";
import Driver from "./components/pages/Driver";
import SideNav from "../config/components/layouts/sidebar";
import CaregiverList from "./components/pages/CaregiverList";
import Caregiver from "./components/pages/Caregiver";
import DriverEdit from './components/pages/DriverEdit'
import Form from './components/pages/form'

import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const ApplicationRoutes = () => {
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
  }, []);

  const handleToggle = (event) => {
    event.preventDefault();
    collapse ? setCollapse(false) : setCollapse(true);
  };
  return (
    <>
      {/* <Route path="/admin" component={Login}/> */}
      <Router>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapse}>
            <SideNav />
          </Sider>
          <Layout>
            <Header style={{ padding: "0px 0px 0px 4px", background: "gray" }}>
              {React.createElement(
                collapse ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: handleToggle,
                  style: { color: "#fff" },
                }
              )}
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: "calc(100vh - 114px)",
                background: "#fff",
              }}
            >
              <Switch>
                <Route exact path="/dashboard" component={Form}/>
                <Route path="/dashboard/user" component={UserList} />
                <Route path="/dashboard/caregiver/:id" component={Caregiver} />
                <Route path="/dashboard/driver/:id" component={Driver} />
                <Route path="/dashboard/edit/:id" component={DriverEdit} />
                <Route path="/dashboard/driver" component={DriverList} />
                <Route path="/dashboard/caregiver" component={CaregiverList} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </>
  );
};

export default ApplicationRoutes;
