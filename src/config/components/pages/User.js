import React, {useEffect, useState} from 'react';
import {Table, Row, Col, Button, Typography} from 'antd';
import {useHistory, withRouter} from 'react-router';
import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom'
import Apicall from '../../../components/Api/Apicall'
const {Title} = Typography;

const User = () => {
  const { id } = useParams();
  const [user,setuser]=useState({})

  const getdata=()=>{
    console.log("id: -----> ", id);
      Apicall({role:'1', id: id},`/user/get_user_detail`).then(res=>{
        console.log("usersid",res.data.data.user_detail)
        setuser(res.data.data.user_detail)
      })
    }
    useEffect(()=>{
     getdata()
    },[])
  
  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.phone}</p>

    </div>
  );
}

export default User;