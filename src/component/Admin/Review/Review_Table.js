import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import { Table, Button, Icon, Popconfirm,Rate } from "antd";
import { Alert_msg } from "../../Comman/alert_msg";
import Search from "antd/lib/input/Search";
import Apicall from "../../../Api/Api";
const Reviews = (props) => {
  const history = useHistory();
  const [datas, setdata] = useState({
    role: "1",
    page: 1,
    per_page: 10,
    search: "",
    sort: "",
  });
  const [loading, setloading] = useState(false);
  const [reviews, setreviews] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10,
    simple: true,
  });
  const [serach, setsearch] = useState("");

  const handlechange = async (pagination, filters, sort) => {
    const pagiante = {
      ...datas,
      page: pagination.current || datas.page,
      search: serach,
      pagination: "true",
    };
    if (props?.tab_option === "delete_user") {
      pagiante["is_deleted"] = true;
    }
    setloading(true);
    await Apicall(pagiante, "/user/get_reviews").then((res) => {
      setloading(false);
      setreviews(res.data.data.docs);
      setPaginationInfo({
        current: res.data.data.page,
        pageSize: 10,
        total: res.data.data.totalDocs,
      });
    });
  };

  const onSearch = (value) => {
    setsearch(value.target.value);
    handlechange(paginationInfo);
  };

  useEffect(() => {
    handlechange(datas);
  }, [datas]);

  const deleteuser = (id) => {
    console.log("----- here we are");
    Apicall({ id }, "/user/delete_user").then((res) => {
      handlechange(datas);
    });
  };

  const Edituser = (id) => {
    if (id) {
      history.push(`/admin/admin-useredit/${id}`);
    } else {
      history.push(`/admin/admin-user/add`);
    }
  };

  const columns = [
    {
      title: "Invoice Id",
      width: "20%",
      render: (text, record) => {
        return <span title="Name">{record.trip_detail.invoice_id}</span>;
      },
    },
    {
        title: "Type",
      width: "20%",
      render: (text, record) => {
        return (
          <span title="Type" >
            {record.rating_type}
          </span>
        );
      },
    },
    {
        title: "Rating",
      width: "20%",
      render: (text, record) => {
        return <span title="Rating"><Rate disabled value={record.rating} /></span>;
      },
    },
    {
        title: "Message",
      width: "20%",
      render: (text, record) => {
        return <span title="Message">{record.message}</span>;
      },
    },
    
  ];

  return (
    <div>
      <div
        className={
          props?.tab_option === "delete_user" ? "d-none" : "mx-2 mx-sm-0 my-3"
        }
      >
        <Search
          className="mt-3"
          size="large"
          placeholder="search invoice id"
          onKeyUp={onSearch}
          // loading={false}
        />
      </div>
      <div id="no-more-tables">
        <Table
          rowClassName={() => "editable-row"}
          className="table_shadow"
          rowKey={(record) => record.id}
          dataSource={reviews}
          columns={columns}
          size="middle"
          pagination={paginationInfo}
          onChange={handlechange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default withRouter(Reviews);