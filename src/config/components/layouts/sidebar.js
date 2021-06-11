import React from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
  } from '@ant-design/icons';
import {useHistory, withRouter}  from 'react-router';

const SideNav = () => {
    const history = useHistory();

    const handleUserClick = () => {
        history.push('/dashboard/user');
    }

    const handleDriverClick = () => {
        history.push('/dashboard/driver');
    }

    const handleCaregiverClick = () => {
        history.push('/dashboard/caregiver');
    }

  return (
      <div>
        <div style={{height: "32px", background: "rgba(255, 255, 255, 0.2)", margin: "16px"}}></div>
            <Menu theme="dark" mode="inline" >
                <Menu.Item key="1" onClick={handleUserClick}>
                    <UserOutlined />
                    <span> Users</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={handleDriverClick}>
                    <VideoCameraOutlined />
                    <span> Drivers</span>
                </Menu.Item>
                <Menu.Item key="3" onClick={handleCaregiverClick}>
                    <UploadOutlined />
                    <span> Caregivers</span>
                </Menu.Item>
            </Menu>
        </div>
  );
}

export default withRouter(SideNav);
