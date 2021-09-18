import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Layout,
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
  Checkbox,
} from "antd";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import "../../../scss/template.scss";
import "../../../scss/Category.scss";
import Apicall from "../../../Api/Api";
import { useParams } from "react-router-dom";
import { Alert_msg } from "../../Comman/alert_msg";
const { Content } = Layout;
const { Title } = Typography;
const DriverStatus = {
  pending: "Update status to interviewed",
  interviewed: "Update status to trained",
  trained: "Update status to approved",
  approved: "Reject and Update status to pending",
};

const Driver_Edit = (props) => {
  const form = props.form;
  const history = useHistory();
  const { id } = useParams();
  const [user, setuser] = useState([]);

  const getdata = () => {
    Apicall({ id: id }, `/user/get_user_detail`).then((res) => {
      console.log("data=>>>>>", res.data.data.user_detail);
      setuser(res.data.data.user_detail);
    });
  };

  const updatestatus = () => {
    var status = "pending";
    switch (user.driver_status) {
      case "pending":
        status = "interviewed";
        break;
      case "interviewed":
        status = "trained";
        break;
      case "trained":
        status = "approved";
        break;
      default:
        status = "pending";
        break;
    }
    Apicall(
      { id: id, driver_status: status },
      `/user/update_driver_status`
    ).then((res) => {
      getdata();
    });
  };
  useEffect(() => {
    if (id) {
      getdata();
    }
  }, [id]);

  const update_user = () => {
    form.validateFields(async (err, values) => {
      console.log(values);
      console.log("update_user -> err", err);
      if (!err) {
        if (id) {
          values["id"] = id;
          Apicall(values, `/user/update_profile`).then((res) => {
            Alert_msg(res.data);
            getdata();
          });
        } else {
          values["role"] = 2;
          Apicall(values, `/auth/sign_up`).then((res) => {
            Alert_msg(res.data);
            if (res.status) {
              history.push(`/admin/admin-user`);
            }
          });
        }
      }
    });
    // Apicall(
    //   { id: id, driver_status: status },
    //   `/user/update_driver_status`
    // ).then((res) => {
    //   getdata();
    // });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <AdminSider />
      <Layout>
        <AdminHeader />
        <Content className="main_frame">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={3}>Edit Driver</Title>
            </Col>
          </Row>
          <Row>
            <Form>
              <Col span={24}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item label="User Name">
                      {form.getFieldDecorator("name", {
                        initialValue: user?.name,
                        rules: [
                          {
                            required: true,
                            message: "Please input your username!",
                          },
                        ],
                      })(<Input placeholder="Name" name="name" />)}
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator("email", {
                        initialValue: user?.email,
                        rules: [
                          {
                            required: true,
                            message: "Please input your Email!",
                          },
                        ],
                      })(<Input placeholder="Email" />)}
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Phone">
                      {form.getFieldDecorator("phone", {
                        initialValue: user?.phone,
                        rules: [
                          {
                            required: true,
                            message: "Please input your phone number!",
                          },
                        ],
                      })(<Input placeholder="Phone Number" />)}
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Status">
                      <Input placeholder="Status" value={user.driver_status} />
                    </Form.Item>
                    <Button className={id?"":"d-none"} onClick={updatestatus}>
                      {DriverStatus[user.driver_status]}
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item className="float-right">
                      {/* <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                      {"  "} */}
                      <Button
                        style={{ backgroundColor: "#f7a400" }}
                        onClick={() => {
                          update_user();
                        }}
                      >
                        Update
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Form>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Form.create()(Driver_Edit);
