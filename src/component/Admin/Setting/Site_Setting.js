import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "antd/dist/antd.css";
import "../../../scss/template.scss";
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Switch,
  Upload,
  Icon,
  Alert,
} from "antd";
import { useParams } from "react-router";
import Apicall from "../../../Api/Api";
import { useHistory } from "react-router-dom";
const Settingpage = () => {
  const { id } = useParams();
  const history=useHistory()
  const [values, setvalues] = useState({
    site_name: "",
    site_email: "",
    site_curency:"",
    appstore_link:"",
    playstore_link:"",
    copyrights_content: "",
    contact_number: "",
    contact_email: "",
    
  });
  const {
    site_name,
    site_email,
    contact_email,
    contact_number,
    copyrights_content,
    playstore_link,
    site_curency,
    appstore_link

  } = values;
  const handlechange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setvalues({ ...values, [name]: value });
  };

  const settingsapi = async () => {
    await Apicall(values, "/setting/get_settings").then((res) => {
      setvalues(res.data.data.settings[0]);
      console.log(res.data.data.settings);
    });
  };
  const update = async (e) => {
    e.preventDefault();
    await Apicall({ ...values, id: id }, "/setting/update_settings").then(
      (res) => {
        setvalues(res.data.data.result);
        console.log(res.data.data.result);

        message.info("updated succssfully");
      }
    );
    history.push('/settings')
  };
  useEffect(() => {
    settingsapi();
  }, []);

  return (
    <>
      <Row gutter={[24]}>
        <Col lg={18} md={24}>
          <Card
            title="General"
            bordered={false}
            extra={
              <Switch
                checkedChildren="Site is on Live.."
                unCheckedChildren="Site is on Maintanence.."
                defaultChecked
              />
            }
            style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}
          >
            <Row>
              <Col span={24}>
                <Form.Item label="Site Name">
                  <Input placeholder="Site Name" className="input_border" value={site_name} onChange={handlechange("site_name")}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Site Email">
                  <Input placeholder="Site Email" className="input_border" value={site_email} onChange={handlechange("site_email")}/>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Copyright content">
                  <Input
                    placeholder="Copyright content"
                    className="input_border"
                    value={copyrights_content}
                    onChange={handlechange("copyrights_content")}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Playstore Link">
                  <Input
                    placeholder="Playstore Link"
                    className="input_border"
                    value={playstore_link}
                    onChange={handlechange("playstore_link")}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Appstore Link">
                  <Input placeholder="Appstore Link" className="input_border" value={appstore_link} onChange={handlechange("appstore_link")} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Contact Number">
                  <Input
                    placeholder="Contact Number"
                    className="input_border"
                    value={contact_number}
                    onChange={handlechange("contact_number")}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Contact Email">
                  <Input placeholder="Contact Email" className="input_border"  value={contact_email} onChange={contact_email}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Site currency">
                  <Input placeholder="Site currency" className="input_border"value={site_curency} onChange={handlechange("site_curency")} />
                </Form.Item>
              </Col>
              <Button type="primary" block onClick={update}>
                Update Setting
              </Button>
            </Row>
          </Card>
        </Col>
        {/* <Col lg={6} md={24}>
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Card
                title="Site Logo"
                bordered={false}
                style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}
              >
                <Form.Item label="">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader img_upload_lg"
                    //   showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    //   beforeUpload={this.beforeUpload}
                    //   onChange={this.handl/eChange_logo}
                  >
                    <img
                      //   src={this.state.img_logo}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  </Upload>
                </Form.Item>
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title="Site Icon"
                bordered={false}
                style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}
              >
                <Form.Item label="">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader img_upload_lg"
                    //   showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    //   beforeUpload={this.beforeUpload}
                    //   onChange={this.handleChange_icon}
                  >
                    <img alt="avatar" style={{ width: "100%" }} />
                  </Upload>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Col> */}
      </Row>
    </>
  );
};
export default Form.create()(Settingpage);
