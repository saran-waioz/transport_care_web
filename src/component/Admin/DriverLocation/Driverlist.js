import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router";
import { Table, Button, Icon, Popconfirm } from "antd";
import Search from "antd/lib/input/Search";

import Apicall from "../../../Api/Api";
const DriverList = () => {
  const history=useHistory()

  const [datas, setdata] = useState({
    role: "2",
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

  const handlechange = async (pagination, filters, sort) => {
    const pagiante = {
      ...datas,
      page: pagination.current || datas.page,
      search: serach,
    };
    setloading(true)
    await Apicall(pagiante, "/user/get_users").then((res) => {
      setloading(false)
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
    console.log("----- here we are");
    Apicall({ id }, "/user/delete_user").then((res) => {
      handlechange(datas);
    });
  };

  return (
    <div>
      <div>
        <h4>Driver Location</h4>
      </div>
      <div>
      <Search
          className="mt-3"
          size="large"
          placeholder="Search driver name"
          onKeyUp={onSearch}
          loading={false}
        />
      </div>
    </div>
  );
};
export default DriverList;
