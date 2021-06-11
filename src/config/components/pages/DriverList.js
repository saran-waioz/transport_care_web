import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Space, Input } from "antd";
import { useHistory, withRouter } from "react-router";
import Apicall from "../../../components/Api/Apicall";
const { Title } = Typography;
const { Search } = Input;

const List = () => {
  const history = useHistory();
  const [datas, setdata] = useState({
    role: "2",
    page:1,
    per_page:5,
    serach:'',
    sort:''

  });
  const [users, setusers] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({current: 1, pageSize: 5 });

  const handlechange = async(pagination, filters, sort) => {
    const pagiante = { ...datas, page: pagination.current || datas.page,  };
    await Apicall(pagiante, "/user/get_users").then((res) => {
      // console.log("pagination------->", res.data.data);
      //pagiante.total = res.data.data.totalDocs;
      //pagiante.current = res.data.data.page;
      //console.log("------------", pagiante);
      //console.log(res.data.data.docs)

      setusers(res.data.data.docs);
      setPaginationInfo({current: res.data.data.page, pageSize: 5, total:res.data.data.totalDocs})
    });
  };

  const Filter = async (value) => {
    await Apicall(datas, "/user/get_users").then((res) => {
      console.log("search================>", res.data.data.docs);
      setusers(res.data.data.docs);
    });
  };

  useEffect(() => {
    handlechange(datas);
  }, [datas]);

  const deletedata = (id) => {
    console.log(id);
    Apicall({ id }, `/user/delete_user`).then((res) => {
      console.log("delete============>", res.data.data.docs);
      handlechange();
    });
  };
  const columns = [
    {
      title: "Username",
      render: (text, record) => {
        return <span title="Username">{record.name}</span>;
      },
    },
    {
      title: "Email",
      render: (text, record) => {
        return <span title="Email">{record.email}</span>;
      },
    },
    {
      title: "Phone",
      render: (text, record) => {
        return <span title="Phone">{record.phone}</span>;
      },
    },
    {
      title: "Action",
      key: "x",
      render: (tezt, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => deletedata(record._id)}>Delete</Button>
            <Button onClick={() => openEditView(record._id)}>Edit</Button>
          </Space>
        );
      },
    },
  ];

  const openEditView = (id) => {
    history.push(`/dashboard/edit/${id}`);
  };

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}>Driver List</Title>
        </Col>
        <Col span={6}>
          <Search
            placeholder="input search text"
            allowClear
            onKeyUp={Filter}
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
    </div>
  );
};

export default List;
