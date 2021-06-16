import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Apicall from "../../component/Api/Apicall";
import "./userList.css";

  export default function DriverEdit() {
    const { id } = useParams();
    const [user, setuser] = useState([]);
  
    const getdata = () => {
      console.log("id: -----> ", id);
      Apicall({ id: id }, `/user/get_user_detail`).then((res) => {
        console.log("usersid=>>>>>", res.data);
        setuser(res.data.data.user_detail);
      });
    };
    useEffect(() => {
      getdata();
    }, []);
  
    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edits User</h1>
          <Link to="/newUser">
            <button className="userAddButton">Create</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userUpdate">
            <span className="userUpdateTitle">Edit</span>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    value={user.name}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    value={user.email}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={user.phone}
                    className="userUpdateInput"
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                {/* <button className="userUpdateButton">Update</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  