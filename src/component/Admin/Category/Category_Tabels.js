import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import {
  Table,
  Button,
  Modal,
  Form,
  Avatar,
  Popconfirm,
  Tag,
  Icon,
  Switch,
} from "antd";
import "../../../scss/template.scss";
import Search from "antd/lib/input/Search";
import Apicall from "../../../Api/Api";

const Category = () => {
  const history = useHistory();
  const [datas, setdata] = useState({
    page: 1,
    per_page: 5,
    search: "",
    sort: "",
  });
  const [users, setusers] = useState([]);
  const [loading,setloading]=useState(false)
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 5,
  });
  const [serach, setsearch] = useState("");
  const [previewVisible, setpreviewVisible] = useState(false);
  const [viewimg, setviewimg] = useState("");

  const handlechange = async (pagination, filters, sort) => {
    const pagiante = {
      ...datas,
      page: pagination.current || datas.page,
      search: serach,
    };
    setloading(true)
    await Apicall(pagiante, "/category/get_category").then((res) => {
      setloading(false)
      setusers(res.data.data.docs);
      console.log("data=>>>",res.data.data.docs);
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

  const deletcategory = (id) => {
    console.log("----- here we are", id);
    Apicall({ id }, "/category/delete_category").then((res) => {
      handlechange(datas);
    });
  };
  const columns = [
    {
      title: <span>Category Name</span>,
      dataIndex: "category_name",
      width: "15%",
      render: (text, record) => {
        return <span title="Category Name">{record.name}</span>;
      },
    },
    {
      title: <span>price</span>,
      dataIndex: "description",
      render: (text, record) => {
        return (
          <span title="Description" style={{ wordBreak: "break-all" }}>
            {record.price}
          </span>
        );
      },
    },
    {
      title: <span>Commission</span>,
      dataIndex: "description",
      render: (text, record) => {
        return (
          <span title="Description" style={{ wordBreak: "break-all" }}>
            {record.commission}
          </span>
        );
      },
    },

    {
      title: <span>Marker</span>,
      render: (text, record) => {
        return (
          <span title="Marker" className="clearfix">
            <Avatar
              src={record.original_image}
              className="img_zoom"
              onClick={() => {
                setusers({
                  setpreviewVisible: true,
                  setviewimg: record.original_image,
                });
              }}
            />
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={() => {
                setusers({ setpreviewVisible: false });
              }}
            >
              <img alt="example" style={{ width: "100%" }} src={viewimg} />
            </Modal>
          </span>
        );
      },
    },
    {
      title: "Action",
      width: "10%",
      dataIndex: "operation",
      render: (text, record) =>
        users.length >= 1 ? (
          <span
            title="...."
            className="d-flex d-sm-inline justify-content-around"
          >
            <span
              className="cursor_point"
              onClick={() => {
                history.push(`/admin-categories/${record._id}`);
              }}
            >
              <Icon
                type="edit"
                theme="twoTone"
                twoToneColor="#F7A400"
                className="mx-3 f_25"
              />
            </span>
            <Popconfirm
              title="Sure to delete because may be under some more sub_category ?"
              onConfirm={() => deletcategory(record._id)}
            >
              <Icon
                type="delete"
                theme="twoTone"
                twoToneColor="#F7A400"
                className="f_25"
              />
            </Popconfirm>
          </span>
        ) : null,
    },
  ];

  return (
    <React.Fragment>
      <div className="mb-3">
        <Search
          className=""
          size="large"
          placeholder="Search Category"
          loading={false}
        />
      </div>
      <div id="no-more-tables">
        <Table
          className="table_shadow"
          pagination={paginationInfo}
          rowKey
          loading={loading}
          dataSource={users}
          columns={columns}
          onChange={handlechange}
        />
      </div>
    </React.Fragment>
  );
};

export default Form.create()(withRouter(Category));
