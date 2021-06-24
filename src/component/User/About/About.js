import React,{Suspense} from "react";
import 'antd/dist/antd.css';
import { Collapse, Affix, Modal, Carousel, Layout, Icon, Form, Input, AutoComplete, List, Avatar, Button, Typography, Row, Col,Skeleton } from 'antd';
import '../../../scss/user.scss';
import { SEARCH_CATEGORY, FIND_CATEGORY } from '../../../graphql/User/home_page';
import { client } from "../../../apollo";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Scrollspy from 'react-scrollspy';
import PlacesAutocomplete, {
    geocodeByAddress,
} from 'react-places-autocomplete';
const { Content } = Layout;

const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));
const AboutQuestion = React.lazy(() => import('./AboutQuestion'));

class About extends React.Component {
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
    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address: address });
        geocodeByAddress(address)
            .then(results => {
                results[0].address_components.map((value, index) => {
                    if (value.types[0] === "locality") {
                        this.setState({ home_page_city: value.long_name });
                    }
                });
            })
            .catch(error => console.error('Error', error));
    };

    setLocationModal(location_modal) {
        this.setState({ location_modal });
    }

    setServiceModal(service_modal) {
        this.setState({ service_modal });
    }

    category_search = async value => {
        console.log(value)
        this.setState({ category_values: value });
        if (value === undefined) {
            value = "a"
        }
        if (value.length >= 1) {
            const { data } = await client.query({
                query: SEARCH_CATEGORY,
                variables: { data: { value: value } },
            });
            this.setState({ auto_complete_data: data ? data.search_category : [] })
        }
    };

    _subcategory_book = async (item) => {
        if (localStorage.getItem('userLogin') === 'success') {
            let data = { type: 2, location: this.state.center, location_detail: this.state.home_page_city };
            this.props.history.push({ pathname: `/description/${item._id}`, state: data });
        } else {
            this.props.history.push('/login');
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

    render() {
        return (
            <Layout className="white">
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserHeader />
                    </Suspense>
                </span>
                <Row className="d-none visible-md">
                    <Col span={24}>
                        <div className="spy_section ant-col ant-col-24 mb-5">
                            <Affix className="ant-col ant-col-24 text-center">
                                <Scrollspy className="ant-col ant-col-24" items={['section-1', 'section-2', 'section-3', 'section-4']} currentClassName="is-current">
                                    <li><a href="#section-1">Why Jiffy</a></li>
                                    <li><a href="#section-2">How it Works</a></li>
                                    <li><a href="#section-3">FAQ's</a></li>
                                    <li><a href="#section-4">Hiring Guide</a></li>
                                </Scrollspy>
                            </Affix>
                        </div>
                    </Col>
                </Row>
                <Content className="px-1">
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
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div className="banner_section d-none d-md-block">
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
                                    <Col span={24} className="h-100">
                                        <div className="d-flex h-100 align-items-center">
                                            <div className="banner_center w-100 text-center">
                                                <h3 className="white-text bold px-2">Your Service Expert in {this.state.home_page_city} </h3>
                                                <p className="white-text normal_font_size mb-5 px-2">Get instant access to reliable and affordable services</p>
                                                <Col sm={{ span: 4, offset: 3 }} xs={{ span: 22, offset: 1 }} className="mr-4 mb-4">
                                                    <Button icon="environment" className="px-1 jiffy_btn h-50x normal_font_size w-100 text-left" onClick={() => this.setLocationModal(true)}>
                                                        {this.state.home_page_city}
                                                    </Button>
                                                </Col>
                                                <Col sm={{ span: 8 }} xs={{ span: 22, offset: 1 }} className="mr-4 mb-4">
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
                                                <Col sm={{ span: 3 }} xs={{ span: 22, offset: 1 }}>
                                                    <Button className="px-1 jiffy_btn h-50x normal_font_size w-100 text-center primary-bg white-text" onClick={() => { this.on_book() }}>
                                                        Book
                                                    </Button>
                                                </Col>
                                                <Modal title="Choose Your Location" centered visible={this.state.location_modal} onOk={() => this.setLocationModal(false)} onCancel={() => this.setLocationModal(false)}>
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
                            <div id="section-1" className="why_jiffy position-relative pt-5 container text-center">
                                <h2 className="bold mb-5 text-center">Why Jiffy</h2>
                                <p className="normal_font_size">
                                    We provide trained and verified packers & movers in Delhi with insurance of up t INR 10,000. Our 4-t rated experts use top quality packaging material for damage free shifting. Book our quality oriented and time-hound experts for hassle-free packing and moving to Chennai. Book packers & movers in Chennai now!
                                    </p>
                            </div>
                            <div id="section-2" className="feature_section pt-5 container mb-5">
                                <h2 className="bold mb-5 text-center">How it Works</h2>
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
                            <div id="section-3" className="faq_section position-relative pt-5 container">
                                <h2 className="bold mb-5 text-center">Frequently Asked Questions</h2>
                                <Suspense fallback={<Skeleton active />}>
                                    <AboutQuestion />
                                </Suspense>
                            </div>
                            <div id="section-4" className="hiring_section position-relative pt-5 container">
                                <h2 className="bold mb-5 text-center">Hiring Guide</h2>
                                <p className="normal_font_size">Verified Companies and Professionals: We use only the top-rated, government-licensed and ISO-certified movers. Every Packer and Mover Professional from UrbanClap goes through 4 Levels of Verification: Background Verification, Consumer Court Case Check, Physical Verification and ID Proof Verification </p>
                                <p className="normal_font_size">Quality of Packing: We use a 3-layered Packing system - using Fabric Sheet covered by a Bubble Wrap further covered by a Corrugated sheet base. Most Local companies just use Fabric sheet. </p>
                                <p className="normal_font_size">Quality of Packing: We use a 3-layered Packing system - using Fabric Sheet covered by a Bubble Wrap further covered by a Corrugated sheet base. Most Local companies just use Fabric sheet. </p>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserFooter />
                    </Suspense>
                </span>
            </Layout>
        );
    }
}
export default Form.create()(About);