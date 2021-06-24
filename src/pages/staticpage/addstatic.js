import { useState } from "react";
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
import Apicall from "../../component/Api/Apicall";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./static.css";
import { useHistory } from "react-router";

const { Content } = Layout;
const { Title } = Typography;

export default function AddStatic() {
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
    history.push("/static");
  };
  const change = (value) => {
    setvalues({ description: value })
}

  return (
    <Content className="main">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={3}>Add Static Page</Title>
        </Col>
      </Row>
      <Row>
        <div className="staticform">
          <Col span={24}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Page Name">
                  <Input
                    placeholder="Name"
                    value={page_name}
                    onChange={handlechange("page_name")}
                    required
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Page Codee">
                  <Input
                    placeholder="Code"
                    value={page_code}
                    onChange={handlechange("page_code")}
                  />
                </Form.Item>
              </Col>

              <Col className="" lg={12}>
                <Form.Item label="Page Title">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={handlechange("title")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="quil">
              <Row className="py-5" gutter={24}>
                <Col className="" lg={24}>
                  <ReactQuill
                    placeholder="Description"
                    value={description}
                    onChange={change}
                  />
                </Col>

                <Col span={24}>
                  <Form.Item className="float-right"></Form.Item>
                </Col>
              </Row>
            </div>
            <button onClick={onsubmit} className="Button">
              Create
            </button>
          </Col>
        </div>
      </Row>
    </Content>
  );
}
