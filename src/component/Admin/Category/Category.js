
import React, { useState } from "react";
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import CategoryTable from './Category_Tabels';
import { Layout, Tabs,Button } from 'antd';
import ParentCategory_Table from "./ParentCategory_Table";
import { useHistory } from "react-router";
const { Content } = Layout;
const { TabPane } = Tabs;
const Category=()=> {
    const history=useHistory()
    const [collapsed,setcollaspsed]=useState(false)
    const onToggle = (val) => {
        setcollaspsed({collapsed:val})
    };
    const openaddcategory=()=>{
        history.push("/admin-categories")
    }
        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider   />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Tabs tabBarExtraContent={
                            <Button type="primary" onClick={()=>openaddcategory()}>
                                Add Category
                          </Button>
                        }>
                            <TabPane tab="Category" key="1">
                                <CategoryTable />
                            </TabPane>
                            {/* <TabPane tab="Parent Category" key="2">
                                <ParentCategory_Table />
                            </TabPane> */}
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }



export default Category;
