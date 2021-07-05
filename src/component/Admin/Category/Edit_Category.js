import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import {
  Layout,
  Icon,
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
  Select,
  Upload,
  Checkbox,
} from "antd";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import Apicallcopy from "../../../Api/Api_formdata";
import Apicall from "../../../Api/Api";
import { useHistory } from "react-router";
import "../../../scss/template.scss";
import "../../../scss/Category.scss";
const { Content } = Layout;
const { Title } = Typography;

const Edit_Category = () => {
  const history = useHistory();
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState({});
  const [loading,setloading]=useState(false)
  const [values, setvalues] = useState({
    name: "",
    price: "",
    commission: "",
    original_image: "",
  });
  const { name, price, commission,original_image } = values;

  const preload = async () => {
    console.log("id===>", id);
    setloading(true)
    await Apicall({ ...values, id: id }, "/category/get_category").then(
      (res) => {
        setloading(false)
        console.log("add--->", res.data.data);
        setvalues({
          name: res.data.data.docs[0].name,
          price: res.data.data.docs[0].price,
          commission: res.data.data.docs[0].commission,
          original_image:res.data.data.docs[0].original_image
        });
      }
    );
  };

  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("commission", values.commission);
    formData.append("type","edit" );
    formData.append("id", id );
    formData.append("file", selectedFile);
    await Apicallcopy(formData, "/category/update_category");
    history.push("/admin-category");
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

  const handleOnChange = ({ file, fileList, event }) => {

    setSelectedFile(file.originFileObj);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };


  // const uploadButton = (
  //   <div>
  //     <Icon type={loading ? "loading" : "plus"} />
  //     <div className="ant-upload-text">Upload</div>
  //   </div>
  // );
  const cancel=()=>{
    history.push("/admin-category")
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <AdminSider />
      <Layout>
        <AdminHeader />
        <Content className="main_frame">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={3}>Edit Category</Title>
            </Col>
          </Row>
          <Row>
            <Form>
              <Col md={18} sm={24}>
                <Row gutter={12}>
                  <Col md={20} sm={24}>
                    <Form.Item label="Category Name">
                      <Input
                        name="Category Name"
                        value={name}
                        placeholder="Category Name"
                        onChange={handlechange("name")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col className="" lg={12}>
                    <Form.Item label="Price">
                      <Input
                        placeholder="Commission"
                        value={price}
                        onChange={handlechange("price")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col className="" lg={12}>
                    <Form.Item label="Commission">
                      <Input
                        placeholder="Commission"
                        value={commission}
                        onChange={handlechange("commission")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="py-3" gutter={12}>
                  <Col span={24}>
                    <Form.Item className="float-right">
                      <Button
                        style={{backgroundColor:'#f7a400'}}
                        htmlType="submit"
                        onClick={update}
                      >
                        Update
                      </Button>{" "}
                      <Button style={{backgroundColor:'#f7a400'}} htmlType="submit" onClick={cancel}>
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={24}>
                <Form.Item label="Image">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader img_upload_lg"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleOnChange}
                  >
                    <img src={original_image} alt="avatar" style={{ width: "100%" }} />
                  </Upload>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Edit_Category;
