import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {
    CardElement,
    injectStripe,
    StripeProvider,
    Elements,
} from 'react-stripe-elements';
import { ACCEPT_JOB_MSG } from '../../../graphql/User/booking';
import { client } from '../../../apollo';
import { Form, Button, Spin } from 'antd';
import { Alert_msg } from '../../Comman/alert_msg';

const createOptions = () => {
    return {
        hidePostalCode: true,
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: 'Open Sans, sans-serif',
                letterSpacing: '0.025em',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#c23d4b',
            },
        }
    }
};

class _CardForm extends Component {
    state = {
        errorMessage: '',
        loading: false,
    };

    handleChange = ({ error }) => {
        if (error) {
            this.setState({ errorMessage: error.message });
        } else {
            this.setState({ errorMessage: '', loading: false, hide: false });
        }
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        // console.log(this.props.stripe)
        this.setState({ loading: true });
        if (this.props.stripe) {
            await this.props.stripe.createToken().then(async result => {
                if (result.error) {
                    this.setState({ errorMessage: result.error.message, loading: false });
                } else {
                    await client.mutate({
                        mutation: ACCEPT_JOB_MSG,
                        variables: { booking_status: 10, booking_id: this.props.data._id, role: 1, stripe_token: result.token.id },
                        fetchPolicy: 'no-cache',
                    }).then(result => {
                        this.setState({ loading: false });
                        // console.log(result);
                        if (result.data.manage_booking[0].status === "success") {
                            Alert_msg({ msg: "Job Booking Success", status: "success" });
                            this.props.history.push('/bookings')
                        } else {
                            Alert_msg({ msg: "Job Booking Cancel Failed", status: "failed" });
                        }
                    });
                    this.setState({ loading: false });
                }
            });
        } else {
            Alert_msg({ msg: "Stripe is not working now ...", status: "failed" });
        }
    };

    render() {
        return (
            <div className="CardDemo w-100">
                <Spin spinning={this.state.loading} className="d-flex justify-content-center mt-4" size="large" >
                    <Form onSubmit={this.handleSubmit}>
                        <label className="w-100">
                            Card details
                      <CardElement
                                onChange={this.handleChange}
                                {...createOptions()}
                            />
                        </label>
                        <div className="error" role="alert">
                            {this.state.errorMessage}
                        </div>
                        <div className="d-flex mx-auto">
                            <Button className="d-flex mx-auto" type="primary" htmlType="submit">
                                Accept and Pay
                    </Button>
                        </div>
                    </Form>
                </Spin>
            </div>
        );
    }
}

const CardForm = injectStripe(withRouter(_CardForm));

export default class Payment extends Component {
    render() {
        console.log(this.props);
        return (

            <StripeProvider apiKey="pk_test_o0jWWupcOMZM6Lq0ZzgfYuGV008gD2UQlB">
                <Elements>
                    <CardForm handleResult={this.props.handleResult} data={this.props.data} />
                </Elements>
            </StripeProvider>
        );
    }
}