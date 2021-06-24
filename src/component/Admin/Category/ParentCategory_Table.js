import * as React from "react";
import { withRouter } from "react-router-dom";
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

const ParentCategory_Table = () => {
  const columns = [
    {
      title: <span>Category Name</span>,
      dataIndex: "category_name",
      width: "15%",
      render: (text, record) => {
        return <span title="Category Name"></span>;
      },
    },
    {
      title: <span>Description</span>,
      dataIndex: "description",
      render: (text, record) => {
        return (
          <span title="Description" style={{ wordBreak: "break-all" }}></span>
        );
      },
    },
    {
      title: "Action",
      width: "10%",
      dataIndex: "operation",
      render: (text, record) => (
        <span
          title="...."
          className="d-flex d-sm-inline justify-content-around"
        >
          <span className="cursor_point">
            <Icon
              type="edit"
              theme="twoTone"
              twoToneColor="#52c41a"
              className="mx-3 f_25"
            />
          </span>
          <Popconfirm title="Sure to delete because may be under some more sub_category ?">
            <Icon
              type="delete"
              theme="twoTone"
              twoToneColor="#52c41a"
              className="f_25"
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="mb-3">
        <Search className="" size="large" placeholder="Search Category" />
      </div>
      <div id="no-more-tables">
        <Table
          className="table_shadow"
          // pagination={this.state.pagination}
          // rowKey={record => record.id}
          // loading={this.state.loading}
          // dataSource={this.state.dataSource}
          columns={columns}
          // onChange={this.handleTableChange}
        />
      </div>
    </React.Fragment>
  );
};

export default Form.create()(withRouter(ParentCategory_Table));
