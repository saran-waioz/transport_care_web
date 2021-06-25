import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { Table, Button, Icon, Popconfirm } from "antd";
import Apicall from "../../../Api/Api";

const StaticTable = () => {
  const history = useHistory();
  const [datas, setdata] = useState({
    page: 1,
    per_page: 5,
    search: "",
    sort: "",
  });
  const [stati, setstatic] = useState([]);
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
      setstatic(res.data.data.docs);
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
    console.log("----- here we are", id);
    Apicall({ id }, "/static/delete_static").then((res) => {
      handlechange(datas);
    });
  };
  const addstatic=()=>{
      history.push(`/admin-statcs`)
  }
  const editstatic=(id)=>{
    history.push(`/admin-statics/${id}`)
}
  const columns = [
    {
      title: "Page Name",
      width: "30%",
      render: (text, record) => {
        return <span title="page name">{record.page_name}</span>;
      },
    },
    {
      title: "Page Code",
      width: "30%",
      render: (text, record) => {
        return <span title="page code">{record.page_code}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (text, record) => (
        // stati.length >= 1 ? (
        <span
          title="...."
          className="d-flex d-sm-inline justify-content-around"
        >
          <span className="cursor_point" onClick={()=>editstatic(record._id)}>
            <Icon
              type="edit"
              theme="twoTone"
              twoToneColor="#F7A400"
              className="mx-3 f_25"
            />
          </span>
          <Popconfirm
            title="Sure to delete Static data ?"
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
      ),
      // ) : null,
    },
  ];

  return (
    <div>
      <div className="my-3">
        <Button style={{backgroundColor:'#F7A400'}}onClick={()=>addstatic()}>Add Static Pages</Button>
      </div>
      <div id="no-more-tables">
        <Table
          rowClassName={() => "editable-row"}
          className="table_shadow"
          dataSource={stati}
          columns={columns}
          size="middle"
          //   pagination={this.state.pagination}
          //   onChange={this.handleTableChange}
          //   loading={this.state.loading}
        />
      </div>
    </div>
  );
};

export default withRouter(StaticTable);
