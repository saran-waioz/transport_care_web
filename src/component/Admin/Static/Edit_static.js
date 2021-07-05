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

const Edit_Static = () => {
  const history = useHistory();
  const { id } = useParams();
  const [values, setvalues] = useState({
    page_name: "",
    page_code: "",
    title: "",
    description: "",
  });
  // const [category, setcatgory] = useState([]);
  const { page_name, page_code, title, description } = values;

  const preload = async () => {
    console.log("id===>", id);
    await Apicall({ ...values, id: id }, "/static/get_static").then((res) => {
      console.log("static--->", res.data.data.docs);
      setvalues({
        page_name: res.data.data.docs[0].page_name,
        page_code: res.data.data.docs[0].page_code,
        title: res.data.data.docs[0].title,
        description: res.data.data.docs[0].description,
      });
    });
  };

  const update = async (e) => {
    e.preventDefault();
    await Apicall({ ...values, id: id, type: "edit" }, "/static/update_static");
    history.push("/admin/admin-static");
  };
  useEffect(() => {
    preload();
  }, []);

  const openCategory = () => {
    history.push("/admin/category");
  };
  const cancel = () => {
    history.push("/admin/admin-static");
  };
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
              <Title level={3}>Edit Static Page</Title>
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
                        style={{ backgroundColor: "#f7a400", 
                       }}
                        htmlType="submit"
                        className="mx-3"
                        onClick={() => cancel()}
                      >
                        Cancel
                      </Button>{" "}
                      <Button
                        style={{ backgroundColor: "#f7a400", 
                       }} // className={this.state.update ? "" : "d-none"}
                        htmlType="submit"
                        onClick={update}
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

export default Form.create()(Edit_Static);
