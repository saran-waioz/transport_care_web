import React,{Suspense} from "react";
import 'antd/dist/antd.css';
import { Layout, Form, Row, Col,Skeleton } from 'antd';

const { Content } = Layout;
const UserHeader = React.lazy(() => import('../User/Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../User/Layout/UserFooter'));

class Terms extends React.Component {
    render() {
        return (
            <Layout className="white" style={{ minHeight: '100vh' }}>
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserHeader />
                    </Suspense>
                </span>
                <Content className="px-1">
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div id="section-1" className="why_jiffy position-relative pt-1 container text-center">
                                <h2 className="bold mb-5 text-center">Terms & Conditions</h2>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserFooter />
                    </Suspense>
                </span>
            </Layout>
        );
    }
}
export default Form.create()(Terms);