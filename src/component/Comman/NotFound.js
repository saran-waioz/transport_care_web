import React from "react";
import 'antd/dist/antd.css';
import { withRouter } from "react-router-dom";
import { Result, Button } from 'antd';
class NotFound extends React.Component {
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, Page Not Found."
                extra={<Button type="primary" onClick={()=>{this.props.history.push("/");}}>Back Home</Button>}
            />
        );
    }
}
export default withRouter(NotFound);