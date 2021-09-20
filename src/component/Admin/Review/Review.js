import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import ReviewTable from './Review_Table';
import HideReview_Table from './HideReview_Table';
import { Layout, Tabs } from 'antd';

const { Content } = Layout;
const { TabPane } = Tabs;

class Review extends React.Component {
    state = {
        collapsed: false,
    };
    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };
    render() {

        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                    <ReviewTable />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default Review;
