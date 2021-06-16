import { useEffect, useState } from "react";
import "./category.css";
import { Upload, Button, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Apicall from "../../component/Api/Apicall";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";


export default function EditCategory() {
  const history = useHistory();
  const { id } = useParams();
  const [values, setvalues] = useState({
    id:"",
    type:'edit',
    name: "",
    price: "",
    commission: "",
    photo: "",
  });
  // const [category, setcatgory] = useState([]);
  const {name,price,commission}=values

  const preload = async () => {
    console.log("id===>",id)
    await Apicall({...values, id:id}, "/category/get_category").then((res) => {
      console.log("add--->", res.data.data.category);
      setvalues({
        name:res.data.data.category[0].name,
        price:res.data.data.category[0].price,
        commission:res.data.data.category[0].commission

      });
    });
  };

  const update=async(e)=>{
    e.preventDefault()
    await Apicall({...values,id:id, type:'edit'},"/category/update_category")
      history.push("/category")
  }
  useEffect(() => {
    preload();
  }, []);



  const openCategory = () => {
    history.push("/category");
  };
  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
  };
  return (
    <div className="newUser">
      <h1 className="newUserTitle">Edit</h1>
      <form>
        <div className="newUserItem">
          <label>Username</label>
          <Input
            placeholder="Username"
            onChange={handlechange("name")}
            value={name}
          />
        </div>
        <div className="newUserItem">
          <label>Commission</label>
          <Input
            placeholder="commission"
            onChange={handlechange("price")}
            value={price}
          />
        </div>
        <div className="newUserItem">
          <label>Price</label>
          <Input
            placeholder="price"
            onChange={handlechange("commission")}
            value={commission}
          />
        </div>
        <div className="file_upload">
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </div>
        <button onClick={update} className="newUserButton">
          Update
        </button>
        <button onClick={() => openCategory()} className="newUserButton">
          Cancel
        </button>
      </form>
    </div>
  );
}
