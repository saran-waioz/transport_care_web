import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserList from "../pages/userList/UserList";
import UserEdit from "../pages/userList/UserEdit";
import Addcategory from "../pages/category/addcategory";
import EditCategory from "../pages/category/editcategory";
import DriverList from "../pages/driverList/driverList";
import CaregiverList from "../pages/caregiverList/caregiverList";
import DriverEdit from "../pages/driverList/driverEdit";
import Topbar from "../components/topbar/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import Home from "../pages/home/Home";
import Category from "../pages/category/category";
import Settings from "../pages/setting/setting"
import Static from "../pages/staticpage/static";
import AddStatic from "../pages/staticpage/addstatic";
import Editstatic from "../pages/staticpage/editstatic";

const Routes = () => {
  return (
    <Router>
      <Topbar />
      <div className="container" style={{ display: "flex", marginTop: "10px" }}>
        <Sidebar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/users">
            <UserList />
          </Route>
          <Route path="/user/:id">
            <UserEdit />
          </Route>
          <Route path="/driver">
            <DriverList />
          </Route>
          <Route path="/drivers/:id">
            <DriverEdit />
          </Route>
          <Route path="/caregiver">
            <CaregiverList />
          </Route>
          <Route path="/category">
            <Category />
          </Route>
          <Route path="/categories/:id">
            <EditCategory />
          </Route>
          <Route path="/newUser">
            <Addcategory/>
          </Route>
          <Route path="/settings">
            <Settings/>
          </Route>
          <Route path="/static">
            <Static/>
          </Route>
          <Route path="/statics">
            <AddStatic/>
          </Route>
          <Route path="/editstatic/:id">
            <Editstatic/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
export default Routes;
