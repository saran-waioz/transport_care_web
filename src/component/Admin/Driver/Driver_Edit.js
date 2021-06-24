import React, { useEffect, useState } from "react";
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
const { Content } = Layout;
const { Title } = Typography;
const DriverStatus = {
  pending: "Update status to interviewed",
  interviewed: "Update status to trained",
  trained: "Update status to approved",
  approved: "Reject and Update status to pending",
};

const Driver_Edit = () => {
  const { id } = useParams();
  const [user, setuser] = useState([]);
  const [values, setvalues] = useState({
    name: "",
    email: "",
    phone: "",
    driver_status: "",
  });
  const { name, email, phone, driver_status } = values;
  const getdata = () => {
    console.log("id: -----> ", id);
    Apicall({ id: id }, `/user/get_user_detail`).then((res) => {
      console.log("data=>>>>>", res.data.data.user_detail);
      setuser(res.data.data.user_detail
      );
    });
  };
  const updatestatus = () => {
    console.log("id: -----> ", user);
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
    getdata();
  }, []);

  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
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
                      <Input
                        placeholder="Name"
                        value={user.name}
                        name="name"
                        onChange={handlechange("name")}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Email">
                      <Input placeholder="Email" value={user.email}/>
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Phone">
                      <Input placeholder="Phone" value={user.phone} />
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Status">
                      <Input placeholder="Status" value={user.driver_status} />
                    </Form.Item>
                    <Button onClick={updatestatus}>
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
                      <Button type="primary" htmlType="submit">
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

export default Driver_Edit;
