import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import Apicall from "../../../Api/Api";
import "../../../scss/template.scss";
import "../../../scss/Category.scss";
import { useHistory, useParams } from "react-router-dom";
const { Content } = Layout;
const { Title } = Typography;

const Add_Static = () => {
  const history = useHistory();
  const [values, setvalues] = useState({
    page_name: "",
    description: "",
    title: "",
    page_code: "",
  });
  const { page_name, description, title, page_code } = values;

  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
  };
  const onsubmit = async (e) => {
    console.log("onsubmit");
    e.preventDefault();
    await Apicall(values, "/static/update_static").then((res) => {
      console.log("add", res.data);
      if (res.error) {
        setvalues({ ...values, error: res.error });
      } else {
        setvalues({
          ...values,
          page_name: "",
          description: "",
          title: "",
          page_code: "",
        });
      }
    });
    history.push("/admin/admin-static");
  };
  const cancel = () => {
    history.push("/admin/admin-static");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <AdminSider />
      <Layout>
        <AdminHeader />
        <Content className="main_frame">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={3}>Add Static Page</Title>
            </Col>
          </Row>
          <Row>
            <Form>
              <Col span={24}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item label="Page Name">
                      <Input
                        placeholder="Name"
                        value={page_name}
                        onChange={handlechange("page_name")}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="" lg={12}>
                    <Form.Item label="Page Code">
                      <Input
                        placeholder="Code"
                        value={page_code}
                        onChange={handlechange("page_code")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Title">
                      <Input
                        placeholder="Title"
                        value={title}
                        onChange={handlechange("title")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="py-3" gutter={12}>
                  <Col className="" lg={24}>
                    <ReactQuill placeholder="Description" value={description} />
                  </Col>

                  <Col span={24}>
                    <Form.Item className="float-right">
                      <Button
                        style={{ backgroundColor: "#f7a400", borderRadius: 10 }}
                        htmlType="submit"
                        className="mx-3"
                        onClick={() => cancel()}
                      >
                        Cancel
                      </Button>{" "}
                      <Button
                        style={{ backgroundColor: "#f7a400", borderRadius: 10 }} // className={this.state.update ? "" : "d-none"}
                        htmlType="submit"
                        onClick={onsubmit}
                      >
                        Create
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

export default Form.create()(Add_Static);
