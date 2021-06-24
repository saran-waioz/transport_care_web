import { useState } from "react";
import "./category.css";
import { Upload, Button, Input, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Apicall from "../../component/Api/Apicall";
import Apicallopy from "../../component/Api/Apicallcopy";
import { useHistory } from "react-router";
import axios from "axios";

export default function Addcategory() {
  const history = useHistory();
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState({});

  const [values, setvalues] = useState({
    name: "",
    price: "",
    commission: "",
    loading: false,
    error: "",
  });
  const { name, price, commission, photo, loading, error } = values;

  const handlechange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setvalues({ ...values, [name]: value });
  };
  const onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("commission", values.commission);
    formData.append("file", selectedFile);
    await Apicallopy(formData, "/category/update_category").then((res) => {
      console.log("add", res.data);
      if (res.error) {
        setvalues({ ...values, error: res.error });
      } else {
        setvalues({
          ...values,
          name: "",
          price: "",
          commission: "",
        });
      }
    });
  };
  const openCategory = () => {
    history.push("/category");
  };

  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file);
    setSelectedFile(file.originFileObj);
    setDefaultFileList(fileList);
  };

  return (
    <div className="newUser">
      <form onSubmit={onsubmit}>
        <h1 className="newUserTitle">New Category</h1>

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
        <div>
          <div class="containers">
            <Upload
              accept="image/*"
              onChange={handleOnChange}
              listType="picture-card"
              defaultFileList={defaultFileList}
              className="image-upload-grid"
            >
              {defaultFileList.length >= 1 ? null : <div>Upload Button</div>}
            </Upload>
            {progress > 0 ? <Progress percent={progress} /> : null}
          </div>
        </div>
        {/* <FileUploaded
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({ error }) => alert(error)}
        /> */}
        <button className="Button">Create</button>
        {"  "}
        <button onClick={() => openCategory()} className="Button">
          Cancel
        </button>
      </form>
    </div>
  );
}
