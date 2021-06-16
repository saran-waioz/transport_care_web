import { useState } from "react";
import "./category.css";
import { Upload, Button, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Apicall from "../../component/Api/Apicall";
import { useHistory } from "react-router";

export default function Addcategory() {
  const history=useHistory()
  const [values, setvalues] = useState({
    name: "",
    price: "",
    commission: "",
    photo: "",
    loading: false,
    error: "",
  });
  const { name, price, commission, photo, loading, error } = values;

  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
  };
  const onsubmit = async (e) => {
    console.log("onsubmit")
    e.preventDefault();
    setvalues({ ...values, error: "", loading: true });
    await Apicall(values, "/category/update_category").then((res) => {
      console.log("add", res.data);
      if (res.error) {
        setvalues({ ...values, error: res.error });
      } else {
        setvalues({
          ...values,
          name: "",
          price: "",
          photo: "",
          commission: "",
        });
      }
    });
  };
const openCategory=()=>{
  console.log("cat")

  history.push("/category");

}
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      // message.error(`${info.file.name} file upload failed.`);
    }
  },
};

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
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
          <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </div>
        <button onClick={onsubmit} className="newUserButton">
          Create
        </button> 
         <button onClick={()=>openCategory()} className="newUserButton">Cancel</button> 
      </form>
   
    </div>
  );
}
