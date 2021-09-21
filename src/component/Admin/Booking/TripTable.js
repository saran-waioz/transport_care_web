import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import { Table, Button, Icon, Popconfirm } from "antd";
import { Alert_msg } from "../../Comman/alert_msg";
import Search from "antd/lib/input/Search";
import Apicall from "../../../Api/Api";

const TripTable = (props) => {
  const history = useHistory();
  const [datas, setdata] = useState({
    trip_status: "",
    page: 1,
    pagination: "true",
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
    await Apicall(pagiante, "/user/get_trips").then((res) => {
      setloading(false);
      setusers(res.data.data.trip_details);
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
  const viewPage = (id) => {
      history.push(`/admin/admin-booking-detail/`+id);
  };
  const columns = [
    {
      title: "Name",
      width: "15%",
      render: (text, record) => {
        return <span title="Name">
          {record.user_detail[0] ? record.user_detail[0].name : 0}</span>;
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
      width: "15%",
      render: (text, record) => {
        return (
          <span title="Email" style={{ wordBreak: "keep-all" }}>
            {record.user_detail[0] ? record.user_detail[0].email : 0}
          </span>
        );
      },
    },
    {
      title: () => {
        return (
          <div>
            <div>Service Type</div>
          </div>
        );
      },
      width: "15%",
      render: (text, record) => {
        return <span title="Service Type">{record.service_type}</span>;
      },
    },
    {
      title: () => {
        return (
          <div>
            <div>Route</div>
          </div>
        );
      },
      width: "25%",
      render: (text, record) => {
        return (
          <div title="Route" className="d-block">
            <div>{record.distances?.origin}</div>
            <div className='d-flex justify-content-center bold'>TO</div>
            <div> {record.distances?.destination}</div>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            <div>Payment Status</div>
          </>
        );
      },
      width: "10%",
      render: (text, record) => {
        return <span title="Payment Status">{record.payment_status}</span>;
      },
    },
    {
      title: () => {
        return (
          <>
            <div>Price Detail</div>
          </>
        );
      },
      width: "10%",
      render: (text, record) => {
        return <span title="Price Detail">{record.price_detail.total}</span>;
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
            <span className="cursor_point" onClick={() => viewPage(record._id)}>
              <Icon
                type="eye"
                theme="twoTone"
                twoToneColor="#F7A400"
                className="mx-3 f_25"
              />
            </span>
          </span>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="mx-2 mx-sm-0 my-3">
        <Search
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

export default withRouter(TripTable);
