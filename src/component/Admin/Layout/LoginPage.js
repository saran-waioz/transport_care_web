import React, { useState, useEffect } from "react";
import { Alert_msg } from "../../Comman/alert_msg";
import Transportcare from "../../../image/logo.png";
import {
  Layout,
  Icon,
  Avatar,
  Input,
  Tooltip,
  Button,
  Typography,
  Card,
  Row,
  Col,
  message,
} from "antd";
import "../../../scss/LoginPage.scss";
import "../../../scss/template.scss";
import { useHistory } from "react-router-dom";
import Apicall from "../../../Api/Api";

const { Header, Content } = Layout;
const { Text } = Typography;

export const LoginPage = () => {
  const history = useHistory();
  const [values, setvalues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = values;
  useEffect(() => {
    localStorage.getItem("adminLogin") === email
      ? history.push({ pathname: "/admin/admin-dashboard" })
      : history.push({ pathname: "/admin" });
  }, []);

  const handleChange = (name) => (event) => {
    setvalues({ ...values, error: false, [name]: event.target.value });
  };

  const onClick = async () => {
    if (email === "" || password === "") {
      Alert_msg({ msg: "Please Fill All Data", status: 'failed' });
    } else {
      const res = await Apicall({ email, password }, "/auth/admin_login");
      console.log(res.data);
      if (res.data.status) {
        localStorage.setItem("adminLogin", email);
        message.info("Login succssfully");
        history.push("/admin/admin-dashboard");
      } else {
        Alert_msg(res.data.message);
      }
    }
  };
  return (
    <div className="h-100">
      <Layout style={{ height: "100vh" }}>
        <Content className="d-flex justify-content-center">
          <Card bordered={true} className="m-auto">
            <Row gutter={[24, 24]}>
              <Col span={24} className="d-flex">
                <img src={Transportcare} style={{ width: "200px" }} alt="" />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Text className="mx-auto" strong>
                  <h2>Sign in</h2>
                </Text>
                <Text className="mx-auto" strong>
                  <h5>Sign in on the internal platform</h5>
                </Text>
              </Col>
            </Row>
            <Input
              size="large"
              placeholder="Enter your email"
              className="input"
              type="email"
              value={email}
              suffix={
                <Tooltip title="only admin enter this site">
                  <Icon
                    type="info-circle"
                    style={{ color: "rgba(0,0,0,.45)" }}
                  />{" "}
                </Tooltip>
              }
              onChange={ handleChange("email")}
            />
            <Input.Password
              size="large"
              placeholder="Password"
              className="my-3"
              value={password}
              onChange={ handleChange("password")}
              //   onPressEnter={onClick}
            />
            <Button
              size="large"
              block
              className="admin_login_btn"
              style={{backgroundColor:"#F7A400",color:'black'}}
              onClick={onClick}
            >
              Login
            </Button>
          </Card>
        </Content>
      </Layout>
    </div>
  );
};
