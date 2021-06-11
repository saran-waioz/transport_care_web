import React, {useEffect, useState} from 'react';
import {Table, Row, Col, Button, Typography} from 'antd';
import {useHistory, withRouter} from 'react-router';
import { useParams } from "react-router-dom";
import Apicall from '../../../components/Api/Apicall'
const {Title} = Typography;

const Caregiver = () => {
  const { id } = useParams();
  const [user,setuser]=useState({})

  const getdata=()=>{
    console.log("id: -----> ", id);
      Apicall({role:'3', id: id},`/user/get_user`).then(res=>{
        console.log("usersid",res.data.data.user_detail)
        setuser(res.data.data.user_detail)
      })
    }
    useEffect(()=>{
     getdata()
    },[])
  
  return (
    <div>
        {user && user.name}
    </div>
  );
}

export default Caregiver;