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
import main from "../../../image/logo.png";

import Apicall from "../../../Api/Api";
import { useParams } from "react-router-dom";
import { Alert_msg } from "../../Comman/alert_msg";
const { Content } = Layout;
const { Title } = Typography;


const BookingInvoice = (props) => {
  const form = props.form;
  const history = useHistory();
  const { id } = useParams();
  const [trip, settrip] = useState([]);
  const [user_detail, set_user_detail] = useState([]);
  const [caregiver_detail, set_caregiver_detail] = useState([]);
  const [driver_detail, set_driver_detail] = useState([]);

  const getdata = () => {
    Apicall({ id: id }, `/user/get_trips`).then((res) => {
      settrip(res.data.data.trip_detail);
      set_user_detail(res.data.data.trip_detail.user_detail[0])
      set_caregiver_detail(res.data.data.trip_detail.caregiver_detail[0])
      set_driver_detail(res.data.data.trip_detail.driver_detail[0])
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
    <Row className="invoice_body_color">
        <Col md={{span:12,offset:6}} sm={24}>
            <Row gutter={24} className="">
                <Col sm={24}>
                    <div className="card">
                        <div className="invoice_header mt-1 w-100">
                            <p><img src={main} alt={'Jiffy'} style={{ width: '150px' }} className='object_fit cursor_point' /></p>
                            <div className="invoice_info">
                                <div>INVOICE NO <b>{trip?.invoice_id}</b></div>
                                <div> <small>{trip?.formatted_created_at}</small></div>
                            </div>
                        </div>
                        <div className="user_batch mx-3 ">
                            <p className="mt-3">{user_detail?.name}</p>
                            <p>Thanks for using Transportcare</p>
                        </div>
                        <div className="total_fare">
                            <h5>TOTAL FARE</h5>
                            <h1><small></small>{trip?.price_detail?.total}</h1>
                            {/* <h6>TOTAL HOURS : asd</h6> */}
                        </div>
                    </div>
                    <div className="card mt-3">
                        <p className="font-weight-bold p-2 m-0 border-bottom">Trip Detail</p>
                        <ul className="list-group p-2">
                            <li className="d-flex list-group-item">
                                <span>Invoice</span>
                                <span className="ml-auto">
                                    <p className="m-0">#{trip?.invoice_id}</p>
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
                    <div className="card mt-3">
                        <p className="font-weight-bold p-2 m-0 border-bottom">User Detail</p>
                        <ul className="list-group p-2">
                            <li className="d-flex list-group-item">
                                <span>Name</span>
                                <span className="ml-auto">{user_detail?.name}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Email</span>
                                <span className="ml-auto">{user_detail?.email}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Phone</span>
                                <span className="ml-auto">{user_detail?.phone}</span>
                            </li>
                        </ul>
                    </div>
                    {trip?.is_care_giver ? 
                    <div className="card mt-3">
                        <p className="font-weight-bold p-2 m-0 border-bottom">Caregiver Detail</p>
                        <ul className="list-group p-2">
                            <li className="d-flex list-group-item">
                                <span>Name</span>
                                <span className="ml-auto">{caregiver_detail?.name}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Email</span>
                                <span className="ml-auto">{caregiver_detail?.email}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Phone</span>
                                <span className="ml-auto">{caregiver_detail?.phone}</span>
                            </li>
                        </ul>
                    </div>
                    : <></>
                    }
                    <div className="card mt-3">
                        <p className="font-weight-bold p-2 m-0 border-bottom">Driver Detail</p>
                        <ul className="list-group p-2">
                            <li className="d-flex list-group-item">
                                <span>Name</span>
                                <span className="ml-auto">{driver_detail?.name}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Email</span>
                                <span className="ml-auto">{driver_detail?.email}</span>
                            </li>
                            <li className="d-flex list-group-item">
                                <span>Phone</span>
                                <span className="ml-auto">{driver_detail?.phone}</span>
                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </Col>
        </Row>
  );
};

export default Form.create()(BookingInvoice);