
import React from "react";
import { Icon,Tooltip } from "antd"
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import { client } from "../../../apollo";
import '../../../scss/template.scss';
import { GET_PARTICULAR_BOOKING } from '../../../graphql/User/booking';
import main from '../../../image/logo.png';

class Invoice extends React.Component {
    state = {
        currency_symbol: '$',
        collapsed: false,
        booking: [],
        booking_user: [],
        booking_provider: [],
        booking_category: []
    };
    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };

    componentDidMount() {
        console.log(this.props.match.params.id);
        this.fetch_booking(this.props.match.params.id);
    }

    fetch_booking = (_id) => {
        client.query({
            query: GET_PARTICULAR_BOOKING,
            variables: { _id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({
                booking: result.data.booking,
                booking_category: result.data.booking[0].booking_category,
                booking_user: result.data.booking[0].booking_user,
                booking_provider: result.data.booking[0].booking_provider,
                message: result.data.booking[0].get_booking_message
            })
        });
    }

    render() {
        const { booking, booking_category, booking_provider, booking_user } = this.state;
        return (
            <div className=" col-xs-12 col-md-12 col-sm-12 invoice_body_color  " >
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-6 main_content mx-lg-auto">
                    <div className="invoice_header mt-1">
                        <p><img src={main} alt={'Jiffy'} className='w-50x object_fit cursor_point' /></p>
                        <div className="invoice_info">
                            <div>INVOICE NO <b>{booking[0] ? booking[0].booking_ref : ""}</b></div>
                            <div> <small>{booking[0] ? booking[0].booking_date : ""}</small></div>
                        </div>
                    </div>
                    <div className="user_batch mx-3">
                        <p><b>{booking_user[0] ? booking_user[0].name : ""}</b></p>
                        <p>Thanks for using Transportcare</p>
                    </div>
                    <div className="total_fare">
                        <h5>TOTAL FARE</h5>
                        <h1><small></small>{booking[0] ? booking[0].total : ""}</h1>
                        {/* <h6>TOTAL HOURS : asd</h6> */}
                    </div>
                    <div className="fare_estimation col-xs-12 col-md-12 col-sm-12 nopad d-print-block d-md-flex">
                        <div className="fare_breakup mr-sm-3">
                            <p className="title">Fare Breakup</p>
                            <ul>
                                <li>
                                    <label>Base Fare</label>
                                    <span>{booking[0] ? booking[0].base_price : ""}</span>
                                </li>
                                {/* <li>
                                            <label>Hour Fare</label>
                                            <span>ad</span>
                                        </li> */}
                                <li>
                                    <label>Extra Fare </label>
                                    <span>{booking[0] ? booking[0].extra_price : ""}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="tax_breakup ">
                            <p className="title">Service Breakup</p>
                            <ul>
                                <li>
                                    <label className="d-flex align-items-center">
                                         Service Fee
                                        <Tooltip placement="right" title={`${booking[0]?.service_fee} %`}>
                                            <Icon className="ml-2 cursor_point" type="info-circle" />
                                        </Tooltip>
                                      
                                    <span className="ml-auto">
                                        {booking[0] ? booking[0].admin_fee : ""}
                                        </span>
                                    </label>
                                </li>
                                {/* <li>
                                    <label>( added to your total fare)</label>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="booking_details col-xs-12 col-md-12 col-sm-12">
                        <p className="title">Trip Details</p>
                        <ul>
                            <li>
                                <label>Service Type</label>
                                <span>{booking_category[0] ? booking_category[0].category_type === 1 ? booking_category[0].category_name : booking_category[0].subCategory_name : ''}</span>
                            </li>
                            <li>
                                <label>Booking Date</label>
                                <span>{booking[0] ? booking[0].booking_date : ""}</span>
                            </li>
                            <li>
                                <label>Scheduled Date</label>
                                <span>{booking[0] ? booking[0].booking_date : ""}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="member_section col-xs-12 col-md-12 col-sm-12 nopad d-print-block d-md-flex">
                        <div className="user_details mr-sm-3">
                            <p className="title">User Details</p>
                            <ul>
                                <li>
                                    <label>Name</label>
                                    <span>{booking_user[0] ? booking_user[0].name : ""}</span>
                                </li>
                                <li>
                                    <label>Email</label>
                                    <span>{booking_user[0] ? booking_user[0].email : ""}</span>
                                </li>
                                <li>
                                    <label>Phone</label>
                                    <span>{booking_user[0] ? booking_user[0].phone_number : ""}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="provider_details">
                            <p className="title">Trip Details</p>
                            <ul>
                                <li>
                                    <label>Name</label>
                                    <span>{booking_provider[0] ? booking_provider[0].name : ""}</span>
                                </li>
                                <li>
                                    <label>Email</label>
                                    <span>{booking_provider[0] ? booking_provider[0].email : ""}</span>
                                </li>
                                <li>
                                    <label>Phone</label>
                                    <span>{booking_provider[0] ? booking_provider[0].phone_number : ""}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="invoice_footer col-xs-12 m-3">
                        <hr />
                        <p>	Thanks,</p>
                        Transportcare Team
	                            </div>
                </div>
            </div>
        );
    }
}

export default Invoice;
