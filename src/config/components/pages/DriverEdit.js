import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Space, Input } from "antd";
import { useHistory, withRouter } from "react-router";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Apicall from "../../../component/Api/Apicall";
const { Title } = Typography;

const DriverStatus = {
'pending' :  'Update status to interviewed',
'interviewed':  'Update status to trained',
'trained' : 'Update status to approved',
'approved' :  'Reject and Update status to pending',
};

const DriverEdit = () => {
  const { id } = useParams();
  const [user, setuser] = useState([]);

  const getdata = () => {
    console.log("id: -----> ", id);
    Apicall({ id: id }, `/user/get_user_detail`).then((res) => {
      console.log("usersid=>>>>>", res.data);
      setuser(res.data.data.user_detail);
    });
  };
  const updatestatus = () => {
    console.log("id: -----> ", user);
    var status = "pending";
    switch (user.driver_status) {
      case "pending":
        status = "interviewed";
        break;
      case "interviewed":
        status = "trained";
        break;
      case "trained":
        status = "approved";
        break;
      default:
        status = "pending";
        break;
    }
    Apicall(
      { id: id, driver_status: status },
      `/user/update_driver_status`
    ).then((res) => {
      getdata();
    });
  };
  useEffect(() => {
    getdata();
  }, []);

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}> Edit Driver</Title>
        </Col>
      </Row>

      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>{user.driver_status}</p>

      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Button onClick={updatestatus}>  
         {DriverStatus[user.driver_status]}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DriverEdit;
//
import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";

import TableBody from "@material-ui/core/TableBody";

import TableCell from "@material-ui/core/TableCell";

import TableContainer from "@material-ui/core/TableContainer";

import TableHead from "@material-ui/core/TableHead";

import TablePagination from "@material-ui/core/TablePagination";

import TableRow from "@material-ui/core/TableRow";

import axios from "axios";

import { useState, useEffect } from "react";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },

  container: {
    maxHeight: 440,
  },
});

export default function MatPaginationTable() {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);

  const [data, setData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    const GetData = async () => {
      const result = await axios("http://localhost:51760/Api/Emp/employee");

      setData(result.data);
    };

    GetData();

    console.log(data);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);

    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>

              <TableCell align="right">Name</TableCell>

              <TableCell align="right">Age</TableCell>

              <TableCell align="right">Address</TableCell>

              <TableCell align="right">City</TableCell>

              <TableCell align="right">ContactNum</TableCell>

              <TableCell align="right">Salary</TableCell>

              <TableCell align="right">Department</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.Id}
                    </TableCell>

                    <TableCell align="right">{row.Name}</TableCell>
                    <TableCell align="right">{row.Age}</TableCell>

                    <TableCell align="right">{row.Address}</TableCell>

                    <TableCell align="right">{row.City}</TableCell>

                    <TableCell align="right">{row.ContactNum}</TableCell>

                    <TableCell align="right">{row.Salary}</TableCell>

                    <TableCell align="right">{row.Department}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

//