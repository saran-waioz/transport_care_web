import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Space, Input } from "antd";
import { useHistory, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Apicall from "../../../components/Api/Apicall";
const { Title } = Typography;

const DriverStatus = {
'pending' :  'Update status to interviewed',
'interviewed':  'Update status to trained',
'trained' : 'Update status to approved',
'approved' :  'Reject and Update status to pending',
};

const DriverEdit = () => {
  const { id } = useParams();
  const [user, setuser] = useState([]);

  const getdata = () => {
    console.log("id: -----> ", id);
    Apicall({ id: id }, `/user/get_user`).then((res) => {
      console.log("usersid=>>>>>", res.data);
      setuser(res.data.data.user_detail);
    });
  };
  const updatestatus = () => {
    console.log("id: -----> ", user);
    var status = "pending";
    switch (user.driver_status) {
      case "pending":
        status = "interviewed";
        break;
      case "interviewed":
        status = "trained";
        break;
      case "trained":
        status = "approved";
        break;
      default:
        status = "pending";
        break;
    }
    Apicall(
      { id: id, driver_status: status },
      `/user/update_driver_status`
    ).then((res) => {
      getdata();
    });
  };
  useEffect(() => {
    getdata();
  }, []);

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}> Edit Driver</Title>
        </Col>
      </Row>

      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>{user.driver_status}</p>

      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Button onClick={updatestatus}>  
         {DriverStatus[user.driver_status]}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DriverEdit;
