import {
  Form,
  Input,
  Typography,
  Button,
  Layout,
  Table,
  Row,
  Col,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Apicall from "../../component/Api/Apicall";
import "./setting.css";

const Settings = () => {
  const { id } = useParams();
  const [values, setvalues] = useState({
    site_name: "",
    site_email: "",
    copyrights_content: "",
    contact_number: "",
    contact_email: "",
  });
  const {
    site_name,
    site_email,
    contact_email,
    contact_number,
    copyrights_content,
  } = values;
  const handlechange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setvalues({ ...values, [name]: value });
  };

  const settingsapi = async () => {
    await Apicall(values, "/setting/get_settings").then((res) => {
      setvalues(res.data.data.settings[0]);
      console.log(res.data.data.settings);
    });
  };
  const update = async (e) => {
    e.preventDefault();
    await Apicall({ ...values, id: id }, "/setting/update_settings").then(
      (res) => {
        setvalues(res.data.data.result);
        message.info("updated succssfully");
      }
    );
  };
  useEffect(() => {
    settingsapi();
  }, []);

  return (
    <>
      {/* <h1 className="newUserTitle">Site Setting</h1> */}

      <div className="newUser">
        <form>
                <h1 className="newUserTitle">Site Setting</h1>

          <div className="newUserItem">
            <label>Sitename</label>
            <Input
              placeholder="Username"
              onChange={handlechange("site_name")}
              value={site_name}
            />
          </div>
          <div className="newUserItem">
            <label>Site Email</label>
            <Input
              placeholder="commission"
              onChange={handlechange("site_email")}
              value={site_email}
            />
          </div>
          <div className="newUserItem">
            <label>Contact Number</label>
            <Input
              placeholder="price"
              onChange={handlechange("contact_number")}
              value={contact_number}
            />
          </div>
          <div className="newUserItem">
            <label>Contact Email</label>
            <Input
              placeholder="price"
              onChange={handlechange("contact_email")}
              value={contact_email}
            />
          </div>
          <div className="newUserItem">
            <label>Content</label>
            <Input
              placeholder="price"
              onChange={handlechange("copyrights_content")}
              value={copyrights_content}
            />
          </div>
          <div></div>
          <button className="settingbtn" onClick={update} >
            Update
          </button>
          {/* <button>Cancel</button> */}
        </form>
      </div>
    </>
  );
};

export default Settings;
