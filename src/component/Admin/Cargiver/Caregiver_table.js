import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import { Table, Button, Icon, Popconfirm } from "antd";
import { Alert_msg } from "../../Comman/alert_msg";
import Search from "antd/lib/input/Search";
import Apicall from "../../../Api/Api";

const Caregiver_Table = (props) => {
  const history = useHistory();
  const [datas, setdata] = useState({
    role: "3",
    page: 1,
    per_page: 10,
    search: "",
    sort: "",
  });
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(false);
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
    };
    if (props?.tab_option === "delete_user") {
      pagiante["is_deleted"] = true;
    }
    setloading(true);
    await Apicall(pagiante, "/user/get_users").then((res) => {
      setloading(false);
      setusers(res.data.data.docs);
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
    Apicall({ id }, "/user/delete_user").then((res) => {
      handlechange(datas);
    });
  };
  const EditUser = (id) => {
    if (id) {
      history.push(`/admin/admin-caregiveredit/${id}`);
    } else {
      history.push(`/admin/admin-caregiver/add`);
    }
  };
  const columns = [
    {
      title: "Name",
      width: "20%",
      render: (text, record) => {
        return <span title="Name">{record.name}</span>;
      },
    },
    {
      title: () => {
        return (
          <div>
            <div className="d-block">
              <div>Email</div>
            </div>
          </div>
        );
      },
      width: "20%",
      render: (text, record) => {
        return (
          <span title="Email" style={{ wordBreak: "keep-all" }}>
            {record.email}
          </span>
        );
      },
    },
    {
      title: () => {
        return (
          <div>
            <div>Phone Number</div>
          </div>
        );
      },
      width: "20%",
      render: (text, record) => {
        return <span title="Phone Number">{record.phone}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      className: props?.tab_option === "delete_user" ? "d-none" : "",
      render: (text, record) =>
        users.length >= 1 ? (
          <span
            title="...."
            className="d-flex d-sm-inline justify-content-around"
          >
            <span className="cursor_point" onClick={() => EditUser(record._id)}>
              <Icon
                type="edit"
                theme="twoTone"
                twoToneColor="#F7A400"
                className="mx-3 f_25"
              />
            </span>
            <Popconfirm
              title="Sure to delete the user ?"
              onConfirm={() => deleteuser(record._id)}
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
    <div>
      <div
        className={
          props?.tab_option === "delete_user" ? "d-none" : "mx-2 mx-sm-0 my-3"
        }
      >
        
        <Search
          className="mt-3"
          size="large"
          placeholder="search"
          onKeyUp={onSearch}
          loading={false}
        />
      </div>
      <div id="no-more-tables">
        <Table
          rowClassName={() => "editable-row"}
          className="table_shadow"
          dataSource={users}
          rowKey={(record) => record.id}
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

export default withRouter(Caregiver_Table);
