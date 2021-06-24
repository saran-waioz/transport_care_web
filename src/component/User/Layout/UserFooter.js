import React from 'react'
import {Link} from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
const { Footer } = Layout;

 const UserFooter = () => {
    return (
        <div>
            <Footer className="footer_bg px-1">
                <Row>
                    <Col lg={{ span: 20, offset: 2 }} className="py-1">
                        Ⓒ 2019 Jiffy
                        <div className='float-right'>
                            <Link to="/about" target="_blank" className="mr-1">About Jiffy</Link>
                            <Link to="/terms" target="_blank" className="mr-1">Terms & Conditions</Link>
                            <Link to="/terms" target="_blank">Policy</Link>
                        </div>
                    </Col>
                </Row>
            </Footer>
        </div>
    )
};
export default UserFooter;