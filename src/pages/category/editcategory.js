import { useEffect, useState } from "react";
import "./category.css";
import { Upload, Button, Input, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Apicall from "../../component/Api/Apicall";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import Apicallcopy from "../../component/Api/Apicallcopy";

export default function EditCategory() {
  const history = useHistory();
  const { id } = useParams();
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [progress, setProgress] = useState(0);
  const [values, setvalues] = useState({
    name: "",
    price: "",
    commission: "",
    original_image: "",
    type: "edit",
  });
  // const [category, setcatgory] = useState([]);
  const { name, price, commission } = values;

  const preload = async () => {
    console.log("id===>", id);
    await Apicall({ ...values, id: id }, "/category/get_category").then(
      (res) => {
        console.log("add--->", res.data.data);
        setvalues({
          name: res.data.data.docs[0].name,
          price: res.data.data.docs[0].price,
          commission: res.data.data.docs[0].commission,
        });
      }
    );
  };

  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("commission", values.commission);
    formData.append("type","edit" );
    formData.append("id", id );
    formData.append("file", selectedFile);
    await Apicallcopy(formData, "/category/update_category");
    history.push("/category");
  };
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

  const handleOnChange = ({ file, fileList, event }) => {
    // console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList);
    setSelectedFile(file.originFileObj);
    //filelist - [{uid: "-1",url:'Some url to image'}]
  };
  return (
    <div className="newUser">
      <form>
        <h1 className="newUserTitle">Edit Category</h1>

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
        <button onClick={update} className="Button">
          update
        </button>
        {"  "}
        <button onClick={() => openCategory()} className="Button">
          Cancel
        </button>
      </form>
    </div>
  );
}
