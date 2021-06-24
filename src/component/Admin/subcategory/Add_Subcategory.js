import React from 'react'
import {withRouter} from "react-router-dom";
import { Layout, Icon, Form, Input,  Button, message, Typography, Row, Col, Select, Upload } from 'antd';
import { ADD_SUBCATEGORY,CATEGORY_NAME,FIND_SUBCATEGORY,UPDATE_SUBCATEGORY } from '../../../graphql/Admin/sub_category';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import {  client } from "../../../apollo";
import '../../../scss/template.scss';
import '../../../scss/Category.scss';
import { Alert_msg } from '../../Comman/alert_msg';
const { Content } = Layout;
const {  Title } = Typography;
const { Option} = Select;


class Add_Subcategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            dataSource: [],
            loading: false,
            imageUrl: '',
            update:0,
            update_data:{},
            file: {},
            previewVisible: false,
            previewImage: '',
            pagination: {
                pageSize: 5,
                current: 1,
                total: 0,
                simple: true,
            },
            selectedItems: [],
            category:[],
            certificate:[],
        };

    }
    componentDidMount() {
        const { form } = this.props;
        form.resetFields();
        this.setState({ imageUrl: '' })
        this.fetch_category();
        console.log(this.props.match.params.id);
        if(this.props.match.params.id !== undefined){
            this.fetch_find_subcategory();
        }
    }
    fetch_category = async()=> {
        await client.query({
            query: CATEGORY_NAME,
            variables:{is_parent:true},
            fetchPolicy: 'no-cache',
        }).then(result => {
            this.setState({ category: result.data.category,certificate:result.data.category[0].Certificate});
        });
    }
    fetch_find_subcategory=async()=>{
        await client.query({
            query: FIND_SUBCATEGORY,
            variables: {_id:this.props.match.params.id},
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({update:1,update_data: result.data.sub_category[0],certificate:result.data.sub_category[0].Certificate,imageUrl:result.data.sub_category[0].img_url});
        });
    }
     normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

     getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

     beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

     handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            console.log(info.file.originFileObj);
            this.setState({ file: info.file.originFileObj });
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    add_subcategory = () => {
        const { form,history } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                await client.mutate({
                    mutation: ADD_SUBCATEGORY,
                    variables: {
                        subCategory_name: values.subCategory_name, base_price: values.base_price,hour_limit: values.hour_limit, hour_price: values.hour_price, service_fee: values.service_fee, certificates: values.certificates,
                        category_id: values.category_name, description: values.description, file: this.state.file
                    },
                }).then((result, loading, error) => {
                    Alert_msg(result.data.addsubCategory.info);
                   if(result.data.addsubCategory.info.status === "success"){
                       history.push('/admin-subcategory');
                   }
                });
            }
        });
    };

    update_subcategory= () => {
        const { form,history } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                await client.mutate({
                    mutation: UPDATE_SUBCATEGORY,
                    variables: {
                        subCategory_name: values.subCategory_name, base_price: values.base_price,hour_limit: values.hour_limit, hour_price: values.hour_price, service_fee: values.service_fee, certificates: values.certificates,
                        category_id: values.category_name, description: values.description, file: this.state.file,_id:this.props.match.params.id
                    },
                }).then((result, loading, error) => {
                    Alert_msg(result.data.updatesubCategory.info);
                   if(result.data.updatesubCategory.info.status === "success"){
                       history.push('/admin-subcategory');
                   }
                });
            }
        });
    };
  
    render() {
        const { form } = this.props;
        const { imageUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Title level={3}>Add Sub Category</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Form>
                                <Col md={18} sm={24}>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item label="Category Name">
                                                {form.getFieldDecorator("category_name", {
                                                     initialValue: this.state.update_data.category_id,
                                                    rules: [{ required: true }]
                                                })(<Select
                                                    style={{ width:"-webkit-fill-available" }}
                                                    // onChange={this.onSecondCityChange}
                                                  >
                                                    {this.state.category.map(data => (
                                                      <Option key={data._id}>{data.category_name}</Option>
                                                    ))}
                                                  </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Sub Category Name">
                                                {form.getFieldDecorator("subCategory_name", {
                                                       initialValue: this.state.update_data.subCategory_name,
                                                    rules: [{ required: true }]
                                                })(<Input name="Sub Category" />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label="Description">
                                                {form.getFieldDecorator("description", {
                                                     initialValue: this.state.update_data.description,
                                                    rules: [{ required: true }]
                                                })(<Input.TextArea placeholder="Description" />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row className="py-3" gutter={12}>
                                        <Col className="" lg={12}>
                                            <Form.Item label="Hour Limit">
                                                {form.getFieldDecorator("hour_limit", {
                                                     initialValue: this.state.update_data.hour_limit,
                                                    rules: [{ required: true,message:'Hour Limit is required' }]
                                                })(<Input placeholder="Hour Limit" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col className="" lg={12}>
                                            <Form.Item label="Basic Price">
                                                {form.getFieldDecorator("base_price", {
                                                      initialValue: this.state.update_data.base_price,
                                                    rules: [{ required: true }]
                                                })(<Input placeholder="Basic Price" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col className="" lg={12}>
                                            <Form.Item label="Hours Price">
                                                {form.getFieldDecorator("hour_price", {
                                                     initialValue: this.state.update_data.hour_price,
                                                    rules: [{ required: true }]
                                                })(<Input placeholder="Hours Price" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col className="" lg={12}>
                                            <Form.Item label="Service Fee">
                                                {form.getFieldDecorator("service_fee", {
                                                    initialValue: this.state.update_data.service_fee,
                                                    rules: [{ required: true ,message: 'Service Fee is required'}]
                                                })(<Input placeholder="service Fee" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item label="Certificates">
                                                {form.getFieldDecorator("certificates", {
                                                    initialValue: this.state.update_data.certificates,
                                                    rules: [{ required: true }]
                                                })(<Select mode="tags" style={{ width: '100%' }} placeholder="Certificate" onChange={(value) => { console.log(value); }}>
                                                {this.state.certificate.map(data =>
                                                    <Option key={data._id}>{data.certificate_name}</Option>
                                                )}
                                            </Select>)}
                                            </Form.Item>

                                        </Col>
                                        <Col span={24}>
                                            <Form.Item className="float-right">
                                                <Button type="primary" htmlType="submit" className="mx-3" onClick={()=>{this.props.history.push('/admin-subcategory')}}>
                                                    Cancel
                                                </Button>
                                                <Button type="primary" className={this.state.update?'d-none':''} htmlType="submit" onClick={this.add_subcategory}>
                                                    Submit
                                                </Button>
                                                <Button type="primary" className={this.state.update?'':'d-none'} htmlType="submit" onClick={this.update_subcategory}>
                                                    Update
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={6} sm={24}>
                                    <Form.Item label="Image">
                                        {form.getFieldDecorator('file', {
                                            rules: imageUrl ==='' ? [{ required : true }]: [{ required : false }],
                                            valuePropName: 'fileList',
                                            getValueFromEvent:this.normFile ,
                                        })(
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader img_upload_lg"
                                                showUploadList={false}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                beforeUpload={this.beforeUpload}
                                                onChange={this.handleChange}
                                            >
                                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                            </Upload>

                                        )}
                                    </Form.Item>
                                </Col>
                            </Form>
                        </Row>
                    </Content>
                </Layout>
            </Layout >
          );
        }
    }
    
export default Form.create()( withRouter(Add_Subcategory));
