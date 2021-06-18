import { useEffect, useState } from "react";
import "./static.css";
import { Layout, Form, Input, Typography, Row, Col } from "antd";
import Apicall from "../../component/Api/Apicall";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
const { Content } = Layout;
const { Title } = Typography;

export default function Editstatic() {
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
        // description:data.data.docs[0].description
      });
    });
  };

  const update = async (e) => {
    e.preventDefault();
    await Apicall({ ...values, id: id, type: "edit" }, "/static/update_static");
    history.push("/static");
  };
  useEffect(() => {
    preload();
  }, []);

  const openCategory = () => {
    history.push("/category");
  };
  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
  };
  return (
    <Content className="main">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={3}>Edit Static Page</Title>
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
                  <ReactQuill placeholder="Description" />
                </Col>

                <Col span={24}>
                  <Form.Item
                    className="float-right"
                    value={description}
                    onChange={handlechange("description")}
                  ></Form.Item>
                </Col>
              </Row>
            </div>
            <button onClick={update} className="Button">
              Update
            </button>
          </Col>
        </div>
      </Row>
    </Content>
  );
}
