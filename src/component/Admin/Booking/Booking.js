import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import  AdminSider from '../Layout/AdminSider';
import  AdminHeader  from '../Layout/AdminHeader';
import BookingTable from './Booking_Table';
import CancelTable from './Cancel_Table';
import { Layout, Tabs } from 'antd';
import CompletedTable from "./Completed_Table";

const { Content } = Layout;
const { TabPane } = Tabs;

class Booking extends React.Component {
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
                        <Tabs>
                            <TabPane tab="Trip" key="1">
                                <BookingTable />
                            </TabPane>
                            <TabPane tab="Trip Cancel" key="2">
                                <CancelTable />
                            </TabPane>
                            <TabPane tab="Trip Completed" key="3">
                                 <CompletedTable/>
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Booking;
