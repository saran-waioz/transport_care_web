import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Applicationroutes from "../config/ApplicationRoutes";
import Loginpage from "../components/login/loginpage";

const Routes = () => {
  return (
      <Switch>
        <Route path="/admin" component={Loginpage} />
        <Route path="/dashboard" component={Applicationroutes} />
      </Switch>
  );
};
export default Routes;
