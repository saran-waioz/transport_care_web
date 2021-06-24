import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Input,
  Layout,
} from "antd";
import { useHistory } from "react-router";
import Apicall from "../../component/Api/Apicall";
const { Title } = Typography;
const { Search } = Input;
const { Content } = Layout;

const Static = () => {
  const history = useHistory();
  const [datas, setdata] = useState({
    page: 1,
    per_page: 5,
    search: "",
    sort: "",

  });
  const [users, setusers] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 5,
  });
  const [serach, setsearch] = useState("");

  const handlechange = async (pagination, filters, sort) => {
    const pagiante = {
      ...datas,
      page: pagination.current || datas.page,
      search: serach,
    };
    await Apicall(pagiante, "/static/get_static").then((res) => {
      setusers(res.data.data.docs);
      console.log(res.data.data.docs);
        setPaginationInfo({
          current: res.data.data.page,
          pageSize: 5,
          total: res.data.data.totalDocs,
        });
    });
  };

    const onSearch = (value) => {
      console.log("--->", value.target.value);
      setsearch(value.target.value);
      handlechange(paginationInfo);
    };

  useEffect(() => {
    handlechange(datas);
  }, [datas]);

  const deleteuser = (id) => {
    console.log("----- here we are",id);
    Apicall( {id} , "/static/delete_static").then(res=>{
      handlechange(datas);
    })
  };
  const columns = [
    {
      title: "Pagename",
      render: (text, record) => {
        return <span title="Pagename">{record.page_name}</span>;
      },
    },
    {
      title: "Pagetitle",
      render: (text, record) => {
        return <span title="Pagetitle">{record.title}</span>;
      },
    },
    {
      title: "Pagecode",
      render: (text, record) => {
        return <span title="Pagecode">{record.page_code}</span>;
      },
    },
    {
      title: "Action",
      key: "x",
      render: (tezt, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => openEditstatic(record._id)}>Edit</Button>
            <Button onClick={() => deleteuser(record._id)}>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const openEditstatic = (id) => {
    history.push(`/editstatic/${id}`);
  };
  const openCreatecategory = () => {
    history.push("/statics");
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: "calc(100vh - 114px)",
        background: "#fff",
      }}
    >
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}>Static List</Title>
          <Button
            style={{
              margin: "2px 2px 2px 2px",
              width: "100px",
              background: "orange",
            }}
            onClick={() => openCreatecategory()}
          >
            Create
          </Button>
        </Col>
        <Col span={6}>
          <Search
            placeholder="input search text"
            allowClear
            onKeyUp={onSearch}
            style={{ width: 200 }}
          />
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={users}
            onChange={handlechange}
            pagination={paginationInfo}
          />
        </Col>
      </Row>
    </Content>
  );
};

export default Static;
