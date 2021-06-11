import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Layout,
  Card,
  Input,
  Form,
  Button,
  Radio,
  Switch,
  Slider,
  Select,
  message,
} from "antd";
import { useHistory } from "react-router";

const { Title } = Typography;

const { Content } = Layout;

const FormApp = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  return (
    <div>
        Dashboard
    </div>
  );
};

export default FormApp;
