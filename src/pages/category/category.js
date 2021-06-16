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

const Category = () => {
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
    // const pagiante = {
    //   ...datas,
    //   page: pagination.current || datas.page,
    //   search: serach,
    // };
    await Apicall(datas, "/category/get_category").then((res) => {
      setusers(res.data.data.category);
      console.log(res.data.data.category);
      //   setPaginationInfo({
      //     current: res.data.data.page,
      //     pageSize: 5,
      //     total: res.data.data.totalDocs,
      //   });
    });
  };

  //   const onSearch = (value) => {
  //     console.log("--->", value.target.value);
  //     setsearch(value.target.value);
  //     handlechange(paginationInfo);
  //   };

  useEffect(() => {
    handlechange(datas);
  }, [datas]);

  const deleteuser = (id) => {
    console.log("----- here we are");
    Apicall({ id }, "/category/delete_category");
    handlechange(datas);
  };
  const columns = [
    {
      title: "Name",
      render: (text, record) => {
        return <span title="Name">{record.name}</span>;
      },
    },
    {
      title: "Price",
      render: (text, record) => {
        return <span title="Price">{record.price}</span>;
      },
    },
    {
      title: "Commission",
      render: (text, record) => {
        return <span title="Commission">{record.commission}</span>;
      },
    },
    {
      title: "Image",
      render: (text, record) => {
        return <span title="Image">{record.image}</span>;
      },
    },
    {
      title: "Action",
      key: "x",
      render: (tezt, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => openEditcategory(record._id)}>Edit</Button>
            <Button onClick={() => deleteuser(record.id)}>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const openEditcategory = (id) => {
    history.push(`/categories/${id}`);
  };
  const openCreatecategory = () => {
    history.push("/newUser");
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
          <Title level={2}>Category List</Title>
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
            // onKeyUp={onSearch}
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

export default Category;
