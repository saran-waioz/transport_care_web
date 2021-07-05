import React from 'react'
import { Layout, Row, Col, Avatar, Menu, Icon, Dropdown ,Skeleton} from 'antd';
import main from '../../../image/main.png';
import useReactRouter from 'use-react-router';
import { GET_SETTING } from '../../../graphql/Admin/static';
import { useQuery } from '@apollo/react-hooks';

const { Header } = Layout;

const UserHeader =() => {
    const { loading, error, data } = useQuery(GET_SETTING, { });  
    const { history } = useReactRouter();
    if (loading) return <p className="container mt-2" style={{backgroundColor:"#eae5e5",width:'100%',height:"30px"}}></p> ;
    const logout = () => {
        if (localStorage.getItem('userLogin') === 'success') {
            localStorage.removeItem('userLogin');
            localStorage.removeItem('user');
            history.push('/login');
        }
    }
    const open_new_tab = (data) => {
        const url = `${data}`;
        console.log(url)
        window.open(url);
    }

    const menu = (
        <Menu>

            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={() => { history.push('/') }} >
                <Icon type="home" />
                Home
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={() => { history.push('/profile') }} >
                <Icon type="user" />
                Profile
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={() => { history.push('/bookings') }} >
                <Icon type="book" />
                Bookings
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={() => { open_new_tab('/about') }}>
                <Icon type="setting" />
                Help & Support
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={() => { open_new_tab('/terms') }}>
                <Icon type="info-circle" />
                Terms & Conditions
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? "d-flex align-items-center px-3" : 'd-none'}
                onClick={logout} >
                <Icon type="logout" />
                Logout
            </Menu.Item>
            <Menu.Item
                className={localStorage.getItem('userLogin') === 'success' ? 'd-none' : "d-flex align-items-center px-3"}
                onClick={() => { history.push('/login') }}>
                <Icon type="login" />
                Login
            </Menu.Item>


            <Menu.Divider />
            <Menu.Item
                className="d-flex align-items-center px-3"
                onClick={() => { open_new_tab('/provider_login') }}>
                <Icon type="shop" theme="twoTone" twoToneColor="#52c41a" />
                <span className="primary_color">Became a Provider</span>
            </Menu.Item>

        </Menu>
    );

    return (
        <div>
            
            <Header className="white user_header px-0">
                <Row>
                    <Col lg={{ span: 20, offset: 2 }} className="px-1">
                        <img src={data?.site_setting_detail?.site_logo} alt={'Jiffy'} className='w-75x object_fit cursor_point' onClick={() => { history.push('/') }} />
                        <div className='float-right cursor_point'>
                            <Dropdown overlay={menu} placement="bottomRight">
                                <Avatar
                                    shape='circle'
                                    className="ant-dropdown-link avatar_shadow"
                                    icon={<Icon type="user" style={{ verticalAlign: "baseline" }} />}
                                    src={JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).img_url : ""} />
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Header>
        </div>
    )
}

export default UserHeader;