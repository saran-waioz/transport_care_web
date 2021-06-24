

import React, { Suspense } from "react";
import 'antd/dist/antd.css';
import { Modal, Carousel, Layout, Icon, Form, Input, AutoComplete, Button, Typography, Row, Col, Card, Avatar, List, Skeleton } from 'antd';
import { GET_CATEGORY, SEARCH_CATEGORY, FIND_CATEGORY, GET_FUTURE, GET_TRENDING } from '../../../graphql/User/home_page';
import { My_APPOINTMENTS } from '../../../graphql/User/booking';
import { client } from "../../../apollo";
import '../../../scss/user.scss';
import OwlCarousel from 'react-owl-carousel';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
const { Content } = Layout;
const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));

// /Home_Page.js


class Home_Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location_modal: false,
            service_modal: false,
            item: null,
            responsive: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 5,
                }
            },
            responsive_first_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 4,
                }
            },
            responsive_second_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 2,
                }
            },
            responsive_third_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 4,
                }
            },
            nav_text: ['', ''],
            address: '',
            home_page_city: 'Madurai',
            category_data: [],
            child_data: [],
            future_data: [],
            child_data_loading: 0,
            auto_complete_data: [],
            trending_booking: [],
            my_booking: [],
            category_values: '',
            center: [9.9252, 78.1198],
        };
    }
    componentDidMount() {
        this.fetch_category();
        this.my_booking();
        this.fetch_trending();
        this.fetch_future();
    }
    setLocationModal(location_modal) {
        this.setState({ location_modal });
    }

    my_booking = async () => {
        if (localStorage.getItem('userLogin') === 'success') {
            await client.query({
                query: My_APPOINTMENTS,
                variables: { _id: JSON.parse(localStorage.getItem('user'))._id, role: 1, booking_status: 10, limit: 5 },
                fetchPolicy: 'no-cache',
            }).then(result => {
                console.log(result);
                this.setState({ my_booking: result.data.get_my_appointments.data });
            });
        }
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address });
        geocodeByAddress(address)
            .then(async results => {
                await getLatLng(results[0]).then(latLng => {
                    results[0].address_components.map((value, index) => {
                        if (value.types[0] === "locality") {
                            this.setState({ home_page_city: value.long_name, center: [latLng.lat, latLng.lng] });
                        }
                    });

                })
            }).catch(error => console.error('Error', error));
    };

    fetch_category = async () => {
        await client.query({
            query: GET_CATEGORY,
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ category_data: result.data.category });
        });
    }

    fetch_trending = async value => {
        const { data } = await client.query({
            query: GET_TRENDING,
        })
        console.log(data.get_trending);
        this.setState({ trending_booking: data ? data.get_trending : [] })
    };
    fetch_future = async value => {
        const { data } = await client.query({
            query: GET_FUTURE,
        })
        console.log(data.get_is_future);
        this.setState({ future_data: data ? data.get_is_future : [] })
    };

    category_search = async value => {
        this.setState({ category_values: value });
        if (value === undefined) {
            value = "a"
        }
        console.log(value.length);
        if (value.length >= 0) {
            const { data } = await client.query({
                query: SEARCH_CATEGORY,
                variables: { data: { value: value } },
            });
            console.log(data);
            this.setState({ auto_complete_data: data ? data.search_category : [] })
        }
    };

    book_category = async (_id, type, is_parent) => {
        console.log(_id, type, is_parent);
        if (is_parent === false || is_parent === null) {
            if (localStorage.getItem('userLogin') === 'success') {
                this.props.history.push({ pathname: `/description/${_id}`, state: { type, location: this.state.center, location_detail: this.state.home_page_city } });
            } else {
                this.props.history.push('/login');
            }
        } else {
            await client.query({
                query: FIND_CATEGORY,
                variables: { _id },
                fetchPolicy: 'no-cache',
            }).then(result => {
                this.setState({ child_data: result.data.category[0] ? result.data.category[0].child_category : [], service_modal: 1 });
            });
        }
    }
    on_book = async () => {
        console.log(this.state.home_page_city);
        console.log(this.state.category_values);
        console.log(this.state.center);
        if (this.state.category_values !== undefined && this.state.center.length > 0) {
            var data = this.state.category_values.split("_");
            if (data[2] === "false") {
                if (localStorage.getItem('userLogin') === 'success') {
                    this.props.history.push({ pathname: `/description/${data[0]}`, state: { type: Number(data[1]), location: this.state.center, location_detail: this.state.home_page_city } });
                } else {
                    this.props.history.push('/login');
                }
            } else {
                await client.query({
                    query: FIND_CATEGORY,
                    variables: { _id: data[0] },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    this.setState({ child_data: result.data.category[0] ? result.data.category[0].child_category : [], service_modal: 1 });
                });
            }
        }
    }
    _trending_book = async (data) => {

        if (localStorage.getItem('userLogin') === 'success') {
            this.props.history.push({ pathname: `/description/${data._id}`, state: { type: data.category_type, location: this.state.center, location_detail: this.state.home_page_city } });
        } else {
            this.props.history.push('/login');
        }
    }
    _subcategory_book = async (item) => {
        if (localStorage.getItem('userLogin') === 'success') {
            let data = { type: 2, location: this.state.center, location_detail: this.state.home_page_city };
            this.props.history.push({ pathname: `/description/${item._id}`, state: data });
        } else {
            this.props.history.push('/login');
        }
    }
    render() {
        return (
            <Layout className="white">
                <Suspense fallback={<p className="container mt-2" style={{backgroundColor:"#eae5e5",width:'100%',height:"30px"}}></p>}>
                    <UserHeader />
                </Suspense>

                <Content className="px-1">
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div className="banner_section">
                                <Carousel autoplay effect="fade">
                                    <div>
                                        <img alt='' src={require("../../../image/handyman.jpg")} />
                                    </div>
                                    <div>
                                        <img alt='' src={require("../../../image/handyman2.jpg")} />
                                    </div>
                                    <div>
                                        <img alt='' src={require("../../../image/handyman3.jpg")} />
                                    </div>
                                </Carousel>
                                <div className="banner_inner">
                                    <Col span={22} offset={2} className="h-100">
                                        <div className="d-flex h-100 align-items-center">
                                            <div className="banner_center w-100">
                                                <h3 className="white-text bold">Your Service Expert in <br /> {this.state.home_page_city} </h3>
                                                <p className="normal_font_size white-text">Get instant access to reliable and affordable services</p>
                                                <Col sm={{ span: 4 }} xs={{ span: 22 }} className="mr-4 mb-4">
                                                    <Button icon="environment" className="px-1 jiffy_btn h-50x normal_font_size w-100 text-left" onClick={() => this.setLocationModal(true)}>
                                                        {this.state.home_page_city}
                                                    </Button>
                                                </Col>
                                                <Col sm={{ span: 8 }} xs={{ span: 22 }} className="mr-4 mb-4">
                                                    <AutoComplete
                                                        className="w-100 h-50x service_autocomplete certain-category-search"
                                                        dropdownClassName="certain-category-search-dropdown"
                                                        onSelect={(value) => { this.setState({ category_values: value }) }}
                                                        onSearch={this.category_search}
                                                        onFocus={this.category_search}
                                                        placeholder="Search for a Services"
                                                        value={this.state.category_values}
                                                        dataSource={this.state.auto_complete_data.map((data, index) => {
                                                            console.log(data);
                                                            return (
                                                                <AutoComplete.Option key={`${data._id}_${data.category_type}_${data.is_parent}`}>
                                                                    {data.category_type === 1 ? data.category_name : data.subCategory_name}
                                                                </AutoComplete.Option>
                                                            );
                                                        })}
                                                    >
                                                        <Input prefix={<Icon type="search" className="certain-category-icon" />} />

                                                    </AutoComplete>
                                                </Col>
                                                <Col sm={{ span: 3 }} xs={{ span: 22 }}>
                                                    <Button className="px-1 jiffy_btn h-50x normal_font_size w-100 text-center primary-bg white-text" onClick={() => { this.on_book() }}>
                                                        Book
                                                    </Button>
                                                </Col>
                                                <Modal title="Choose Your Location" style={{ borderRadius: "2em" }} className="home_modal new_modal" centered style={{ top: 20 }} visible={this.state.location_modal} onOk={() => this.setLocationModal(false)} onCancel={() => this.setLocationModal(false)}>
                                                    <PlacesAutocomplete
                                                        value={this.state.address}
                                                        onChange={this.handleChange}
                                                        onSelect={this.handleSelect}
                                                    >
                                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                            <div className="position-relative">
                                                                <input
                                                                    {...getInputProps({
                                                                        placeholder: 'Location',
                                                                        className: 'location-search-input jiffy_input place_input',
                                                                    })}
                                                                />
                                                                <div className="autocomplete-dropdown-container">
                                                                    {loading && <div className="suggest_load">Loading...</div>}
                                                                    {suggestions.map(suggestion => {
                                                                        const className = suggestion.active
                                                                            ? 'suggestion-item--active'
                                                                            : 'suggestion-item';
                                                                        // inline style for demonstration purpose
                                                                        const style = suggestion.active
                                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                        return (
                                                                            <div
                                                                                {...getSuggestionItemProps(suggestion, {
                                                                                    className,
                                                                                    style,
                                                                                })}
                                                                            >
                                                                                <span>{suggestion.description}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </PlacesAutocomplete>
                                                </Modal>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <div className="featured_category container position-relative">
                                {this.state.category_data.length > 0 ?
                                    <OwlCarousel className="owl-theme cursor_point" items={5} dots={false} nav={true} navText={this.state.nav_text} responsive={this.state.responsive} margin={10}>
                                        {this.state.category_data.map((data, i) =>
                                            <div className={"item"} key={i} onClick={() => { this.book_category(data._id, data.category_type, data.is_parent) }}>
                                                <Avatar size={100} src={data.img_url} className='mx-auto d-block' />

                                                {/* <img src={data.img_url} className="mx-auto w-auto" /> */}
                                                <p className="text-center py-4">{data.category_name}</p>
                                            </div>
                                        )}
                                    </OwlCarousel>
                                    : ""}

                                <Modal footer={<></>} title="List subcategory based on category" className="new_modal" centered visible={this.state.service_modal} onOk={() => { this.setState({ service_modal: 0 }) }} onCancel={() => { this.setState({ service_modal: 0 }) }}>
                                    <List
                                        className="mt-4 mx-5"
                                        bordered
                                        itemLayout="horizontal"
                                        dataSource={this.state.child_data}
                                        renderItem={item => (
                                            <List.Item style={{ cursor: 'pointer' }} onClick={() => { this._subcategory_book(item) }}>
                                                <Typography.Text ><Avatar src={item.img_url} /></Typography.Text>
                                                <Typography.Text className="px-4">{item.subCategory_name}</Typography.Text>
                                            </List.Item>
                                        )}
                                    />

                                </Modal>
                            </div>
                            <div className="first_category position-relative pt-5">
                                {this.state.future_data.length > 0 ?
                                    <>
                                        <h2 className="bold mb-5 text-center">Featured Categories</h2>
                                        <OwlCarousel className="owl-theme cursor_point" items={5} dots={false} nav={true} navText={this.state.nav_text} responsive={this.state.responsive_first_category} margin={30}>
                                            {this.state.future_data.map((data, i) =>
                                                <div className={"item"} key={i} onClick={() => { this.book_category(data._id, data.category_type, data.is_parent) }}>
                                                    <img alt='' src={data.img_url} className="mx-auto" />
                                                    <p className="text-center py-4">{data.category_type === 1 ? data.category_name : data.subCategory_name}</p>
                                                </div>
                                            )}
                                        </OwlCarousel>
                                    </>
                                    : <></>}
                            </div>
                            <div className="second_category position-relative pt-5">
                                {this.state.trending_booking.length > 0 ?
                                    <>
                                        <h2 className="bold mb-5 text-center">Trending and Event Services</h2>
                                        <OwlCarousel
                                            className="owl-theme cursor_point"
                                            items={5}
                                            dots={false}
                                            nav={true}
                                            navText={this.state.nav_text}
                                            responsive={this.state.responsive_second_category}
                                            margin={30}>
                                            {this.state.trending_booking.map((data, i) =>
                                                <div className={`item item${i}`} key={i} onClick={() => { this._trending_book(data) }}>
                                                    <img alt='' src={data.img_url} className="mx-auto" />
                                                    <p className="text-center py-4">
                                                        {data.category_type === 1 ? data.category_name : data.subCategory_name}
                                                    </p>
                                                </div>
                                            )}
                                        </OwlCarousel>
                                    </>
                                    : <></>}
                            </div>
                            <div className="third_category position-relative pt-5">
                                {this.state.my_booking.length > 0 ?
                                    <>
                                        <h2 className="bold mb-5 text-center">My Bookings</h2>
                                        <OwlCarousel className="owl-theme cursor_point" items={5} dots={false} nav={true} navText={this.state.nav_text} responsive={this.state.responsive_second_category} margin={30}>
                                            {this.state.my_booking.map((data, i) =>
                                                <Card className="d-flex flex-wrap border bookings_div" onClick={() => { this.props.history.push('/bookings') }}
                                                    style={{
                                                        borderRadius: '1em',
                                                    }} >
                                                    <Row className="d-flex">
                                                        <Col xs={18} md={20} className="py-3 pl-4">
                                                            <p className="m-0">{data.booking_ref}</p>
                                                            <h5 className="bold">{data.booking_category[0].category_type === 1 ? data.booking_category[0].category_name : data.booking_category[0].subCategory_name}</h5>
                                                            <p className="m-0">{data.booking_date}</p>
                                                            <div className="primary_color">{data.base_price}</div>
                                                        </Col>
                                                        <Col xs={6} md={4}>
                                                            <img alt='' className="w-100 h-100" src={data.booking_category[0].category_type === 1 ? data.booking_category[0].img_url : data.booking_category[0].booking_parent_category[0].img_url} />
                                                        </Col>
                                                    </Row>
                                                    <Row className="d-flex my-3 p-1" style={{
                                                        borderRadius: '1em',
                                                        backgroundColor: '#f2f2f2'
                                                    }}>

                                                        <Col xs={4} md={4} >
                                                            <img alt='' className="w-100 h-100" src={data.booking_provider[0].img_url} />
                                                        </Col>
                                                        <Col xs={20} md={20} className="py-3 pl-4 d-flex justify-content-between">
                                                            <p className="m-0">{data.booking_provider[0].name}</p>
                                                            <p className="m-0">{data.booking_provider[0].phone_number}</p>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            )}
                                        </OwlCarousel>
                                    </> : <></>
                                }
                            </div>
                          
                            <div className="download_section position-relative pt-5 text-center">
                                <h2 className="bold mb-5 text-center">Download the App</h2>
                                <p className="normal_font_size">Choose and book 100+ services and track them on Jiffy App</p>
                                <img alt='' className="mr-3" src={require("../../../image/play_store.png")} />
                                <img alt='' className="ml-3" src={require("../../../image/app_store.png")} />
                            </div>
                            <div className="feature_section pt-5 container mb-5">
                                <Row>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/quality.png")} /></div>
                                        <p className="normal_font_size my-3 bold">High Quality & Trusted Professionals</p>
                                        <label>We Provide only verified, background checked and high quality profiessionals</label>
                                    </Col>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/budget-management.png")} /></div>
                                        <p className="normal_font_size my-3 bold">Matched to Your Needs</p>
                                        <label>We match you with the right professionals with the right budget</label>
                                    </Col>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/like.png")} /></div>
                                        <p className="normal_font_size my-3 bold">Hazzle Free Services</p>
                                        <label>Super convenient, guaranteed service from booking to delivery</label>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <Suspense fallback={<Skeleton active />}>
                    <UserFooter />
                </Suspense>
            </Layout >
        );
    }
}
export default Form.create()(Home_Page);