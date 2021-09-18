import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import {
  Switch,
  Redirect,
  Route,
  BrowserRouter,
  useHistory,
} from "react-router-dom";
import "./index.css";
import "./scss/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";
import { client } from "./apollo";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloProviderHooks } from "@apollo/react-hooks";
import { LoginPage } from "./component/Admin/Layout/LoginPage";
import Dashboard from "./component/Admin/Dashboard/Dashboard";
import Category from "./component/Admin/Category/Category";
import Add_Category from "./component/Admin/Category/Add_Category";
import Subcategory from "./component/Admin/subcategory/Subcategory";
import Add_Subcategory from "./component/Admin/subcategory/Add_Subcategory";
import Booking from "./component/Admin/Booking/Booking";
import Provider from "./component/Admin/Provider/Provider";
import Add_Provider from "./component/Admin/Provider/Add_Provider";
import Provider_Verified from "./component/Admin/Provider/Provider_Verified";
import Certificate from "./component/Admin/Certificate/Certificate";
import User from "./component/Admin/User/User";
import Add_User from "./component/Admin/User/Add_User";
import Static from "./component/Admin/Static/Static";
import Add_Static from "./component/Admin/Static/Add_static";
import User_Login from "./component/User/Login/User_Login";
import Home_Page from "./component/User/HomePage/Home_Page";
import About_Page from "./component/User/About/About";
import Profile_Page from "./component/User/Profile/Profile";
import Bookings_Page from "./component/User/Book/Bookings";
import Terms_Page from "./component/Comman/Terms";
import NotFound from "./component/Comman/NotFound";
import Description_Page from "./component/User/Book/Description";
import Payouts from "./component/Admin/Payouts/Payouts";
import Review from "./component/Admin/Review/Review";
import Settings from "./component/Admin/Setting/Setting";
import Email_Login from "./component/User/Login/Email_Login";
import Request from "./component/Admin/Request/Request";
import Booking_Details from "./component/Admin/Booking/Booking_Details";
import Invoice from "./component/Admin/Booking/invoice";
import provider_detail from "./component/User/Provider/Provider_Details";
import provider_earnings from "./component/User/Provider/Provider_Earns";
import Booking_Detail from "./component/User/Provider/Booking_Detail";
import Provider_Email_Login from "./component/User/Login/Provider_Email_Login";
import Provider_Login from "./component/User/Login/Provider_Login";
import { ConfrimPassword } from "./component/User/Login/ConfrimPassword";
import { CHECK_DEMO } from "./graphql/User/login";
import { Alert_msg } from "./component/Comman/alert_msg";
import Driver from "./component/Admin/Driver/Driver";
import Caregiver from "./component/Admin/Cargiver/Caregiver";
import Driver_Edit from "./component/Admin/Driver/Driver_Edit";
import Edit_Category from "./component/Admin/Category/Edit_Category";
import Edit_Static from "./component/Admin/Static/Edit_static";
import DriverLocation from "./component/Admin/DriverLocation/Driver_locat_table";
import Caregiver_Edit from "./component/Admin/Cargiver/Caregiver_Edit";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* <Route exact path="/" component={Home_Page} /> */}
      <Route exact path="/admin" component={LoginPage} />
      <Route path="/admin/admin-dashboard" component={Dashboard} />
      <Route path="/admin/admin-driver" component={Driver} exact />
      <Route path="/admin/admin-driver/add" component={Driver_Edit} exact />
      <Route path="/admin/admin-driveredit/:id" component={Driver_Edit} exact />
      <Route path="/admin/admin-location" component={DriverLocation}/>
      <Route path="/admin/admin-user" component={User} exact />
      <Route path="/admin/admin-user/add" component={Add_User} exact />
      <Route path="/admin/admin-useredit/:id" component={Add_User} exact />
      <Route path="/admin/admin-caregiver" component={Caregiver} exact />
      <Route path="/admin/admin-caregiver/add" component={Caregiver_Edit} exact />
      <Route path="/admin/admin-caregiveredit/:id" component={Caregiver_Edit} exact />
      <Route path="/admin/admin-category" component={Category} exact />
      <Route path="/admin/admin-categories" component={Add_Category} exact />
      <Route path="/admin/admin-categories/:id" component={Edit_Category} exact />
      <Route path="/admin/settings" component={Settings} exact />
      <Route path="/admin/admin-static" component={Static} exact />
      <Route path="/admin/admin-statcs" component={Add_Static} exact />
      <Route path="/admin/admin-statics/:id" component={Edit_Static} exact />
      <Route path="/admin/admin-booking" component={Booking} />
      <Route path="/admin/admin-booking-detail" component={Booking_Details} />
      <Route path="/admin/admin-booking-invoice/:id" component={Invoice} exact />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
