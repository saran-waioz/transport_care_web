import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Apicall from "../../component/Api/Apicall";
import "./driverList.css";
const DriverStatus = {
  pending: "Update status to interviewed",
  interviewed: "Update status to trained",
  trained: "Update status to approved",
  approved: "Reject and Update status to pending",
};
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
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Driver Edit</h1>
        {/* <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link> */}
      </div>
      <div className="userContainer">
        <div className="userUpdate">
         
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

              <div className="userUpdateItem">
                <label>Status</label>
                <h4>{user.driver_status}</h4>
                <span>
                  <button style={{padding:'5px',marginTop:10}} onClick={updatestatus}>
                    {DriverStatus[user.driver_status]}
                  </button>
                </span>
              </div>
            </div>
            <div className="userUpdateRight">
              {/* <button className="userUpdateButton">Update</button> */}
            </div>
        </div>
      </div>
    </div>
  );
}
