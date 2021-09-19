import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import {
  Layout,
  Form,
  Input,
  Button,
  Table,
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
  const [userwallet, setuserwallet] = useState([]);
  const [walletloading, setwalletloading] = useState(false);

  const getdata = () => {
    setwalletloading(true)
    Apicall({ id: id }, `/user/get_user_detail`).then((res) => {
      console.log("data=>>>>>", res.data.data.user_detail);
      get_wallet_data(res.data.data.user_detail._id)
      setuser(res.data.data.user_detail);
    });
  };
  const get_wallet_data = (id) => {
    Apicall({ user_id: id }, `/user/get_wallet_data`).then((res) => {
      setuserwallet(res.data.data);
      setwalletloading(false)
    });
  };
  const wallet_history_columns = [
    {
      title: "Amount",
      width: "50%",
      render: (text, record) => {
        return <span title="Amount">{record.amount}</span>;
      },
    },
    {
      title: "Received",
      width: "50%",
      render: (text, record) => {
        return <span title="Received">{record.show_created}</span>;
      },
    },
  ];
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
            <Form >
              <Col span={24}>
                <Row gutter={12}>
                  <Col className="mb-4" span={24}>
                  <img src={user?.original_profile_image} alt="avatar" class="h-50x w-50x" />
                  </Col>
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
            <Col span={24}>
              <Row gutter={12}>
                <Col span={12} className="border p-2">
                  <label>Insurance</label>
                  <img src={user?.original_vehicle_insurance_document} alt="avatar" class="w-100 o-contain h-300x" />
                </Col>
                <Col span={12} className="border p-2">
                  <label>Registration Certificate</label>
                  <img src={user?.original_vehicle_rc_document} alt="avatar" class="w-100 o-contain h-300x" />
                </Col>
                <Col span={12} className="border p-2">
                  <label>Driving License</label>
                  <img src={user?.original_driver_license} alt="avatar" class="w-100 o-contain h-300x" />
                </Col>
                <Col span={12} className="border p-2">
                  <label>Attender Proof</label>
                  <img src={user?.original_attender_proof} alt="avatar" class="w-100 o-contain h-300x" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8} className="card mt-4">
                  <h1 class="mb-0">{userwallet?.wallet_amount}</h1>
                  <p>Wallet Amount</p>
                </Col>
                <Col span={8} className="card mt-4">
                  <h1 class="mb-0">{userwallet?.received_wallet}</h1>
                  <p>Received Amount</p>
                </Col>
                <Col span={8} className="card mt-4">
                  <h1 class="mb-0">{userwallet?.wallet_amount - userwallet?.received_wallet}</h1>
                  <p>Remaining Amount</p>
                </Col>
                <Col span={24} className="card mt-4 py-3">
                  <p class="font-weight-bold">Wallet History</p>
                  <Table
                    rowClassName={() => "editable-row"}
                    className="table_shadow"
                    rowKey={(record) => record.id}
                    dataSource={userwallet.wallet_history}
                    columns={wallet_history_columns}
                    size="middle"
                    loading={walletloading}
                  />
                </Col>
                <Col span={24} className="card mt-4 py-3">
                  <p class="font-weight-bold">Manual Settlement</p>
                  
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Form.create()(Driver_Edit);
