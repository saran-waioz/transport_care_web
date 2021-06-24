import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import { Table, Button, Icon, Popconfirm } from "antd";
import Search from "antd/lib/input/Search";

import Apicall from "../../../Api/Api";
const DriverList = () => {
  const history = useHistory();

  const [datas, setdata] = useState({
    role: "2",
    page: 1,
    per_page: 5,
    search: "",
    sort: "",
  });
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(false);
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
    setloading(true);
    await Apicall(pagiante, "/user/get_users").then((res) => {
      setloading(false);
      setusers(res.data.data.docs);
      console.log(res.data.data.docs);
      setPaginationInfo({
        current: res.data.data.page,
        pageSize: 5,
        total: res.data.data.totalDocs,
      });
    });
  };

  useEffect(() => {
    handlechange(datas);
  }, [datas]);

  return (
    <div>
      <div>
        <h4>Driver List</h4>
      </div>
      <div>
        {users.map((i, s) => {
          return (
            <div key={s}>
              <Button type="primary" htmlType="submit">
                {i.name}
              </Button>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DriverList;
