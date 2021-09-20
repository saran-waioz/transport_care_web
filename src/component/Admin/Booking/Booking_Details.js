import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import {
  Layout,
  Form,
  Input,
  Button,
  Table,
  Rate,
  message,
  Typography,
  Row,
  Col,
  Checkbox,
} from "antd";
import AdminSider from "../Layout/AdminSider";
import AdminHeader from "../Layout/AdminHeader";
import "../../../scss/template.scss";
import "../../../scss/Category.scss";
import Apicall from "../../../Api/Api";
import { useParams } from "react-router-dom";
import { Alert_msg } from "../../Comman/alert_msg";
const { Content } = Layout;
const { Title } = Typography;


const BookingDetail = (props) => {
  const form = props.form;
  const history = useHistory();
  const { id } = useParams();
  const [trip, settrip] = useState([]);


  const getdata = () => {
    Apicall({ id: id }, `/user/get_trips`).then((res) => {
      settrip(res.data.data.trip_detail);
    });
  };
  
    const viewPage = (id) => {
        history.push(`/admin/admin-booking-invoice/`+id);
    };
 
  useEffect(() => {
    if (id) {
      getdata();
    }
  }, [id]);

  return (
    <Layout style={{ height: "100vh" }}>
      <AdminSider />
      <Layout>
        <AdminHeader />
        <Content className="main_frame bg-transparent p-0">
          <Row gutter={[24, 24]}>
            <Col md={16} sm={24}>
                <div className="card">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Trip Detail</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Invoice</span>
                            <span className="ml-auto">
                                <p className="m-0">#{trip?.invoice_id}</p>
                                <small className="cursor_point" onClick={() => viewPage(trip?.id)}>View Invoice</small>
                            </span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Booking Type</span>
                            <span className="ml-auto">{(trip?.booking_type=='now')?'Current':'Scheduled'}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Category</span>
                            <span className="ml-auto">
                                <p className="m-0">{trip?.category_detail?.name}</p>
                                <small>{trip?.category_detail?.price} per km - {trip?.category_detail?.commission}% commission</small>
                            </span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Service Type</span>
                            <span className="ml-auto">{trip?.service_type}</span>
                        </li>
                        <li className="list-group-item">
                            <p className="m-0">Pick Up</p>
                            <span className="">{trip?.distances?.origin}</span>
                        </li>
                        <li className="list-group-item">
                            <p className="m-0">Destination</p>
                            <span className="">{trip?.distances?.destination}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Distance</span>
                            <span className="ml-auto">{trip?.distances?.distance}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Booked at</span>
                            <span className="ml-auto">{trip?.formatted_created_at}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Status</span>
                            <span className="ml-auto">{trip?.trip_status}</span>
                        </li>
                    </ul>
                </div>
                <div className="card mt-3">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Price Detail</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Total</span>
                            <span className="ml-auto">SGD {trip?.price_detail?.total}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Commission</span>
                            <span className="ml-auto">SGD {trip?.price_detail?.commission}</span>
                        </li>
                    </ul>
                </div>          
            </Col>
            <Col md={8} sm={24}>
                <div className="card">
                    <p className="font-weight-bold p-2 m-0 border-bottom">User Detail</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Name</span>
                            <span className="ml-auto">{trip?.user_detail?.name}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Email</span>
                            <span className="ml-auto">{trip?.user_detail?.email}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Phone</span>
                            <span className="ml-auto">{trip?.user_detail?.phone}</span>
                        </li>
                    </ul>
                </div>
                <div className="card mt-3">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Caregiver Detail</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Name</span>
                            <span className="ml-auto">{trip?.user_detail?.name}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Email</span>
                            <span className="ml-auto">{trip?.user_detail?.email}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Phone</span>
                            <span className="ml-auto">{trip?.user_detail?.phone}</span>
                        </li>
                    </ul>
                </div>
                <div className="card mt-3">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Driver Detail</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Name</span>
                            <span className="ml-auto">{trip?.driver_detail?.name}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Email</span>
                            <span className="ml-auto">{trip?.driver_detail?.email}</span>
                        </li>
                        <li className="d-flex list-group-item">
                            <span>Phone</span>
                            <span className="ml-auto">{trip?.driver_detail?.phone}</span>
                        </li>
                    </ul>
                </div>
                <div className="card mt-3">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Driver Payout</p>
                    <ul className="list-group p-2">
                        <li className="d-flex list-group-item">
                            <span>Amount</span>
                            <span className="ml-auto">SGD {trip?.price_detail?.driver_payout}</span>
                        </li>
                    </ul>
                </div>
                <div className="card mt-3">
                    <p className="font-weight-bold p-2 m-0 border-bottom">Ratings</p>
                    <ul className="list-group p-2">
                        <li className="list-group-item">
                            <p className="m-0">User</p>
                            <div className="text-center">
                                <Rate disabled value={trip?.user_rating?.rating} />
                                <p className="m-0">{trip?.user_rating?.message}</p>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <p className="m-0">Driver</p>
                            <div className="text-center">
                                <Rate disabled value={trip?.driver_rating?.rating} />
                                <p className="m-0">{trip?.driver_rating?.message}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Form.create()(BookingDetail);
