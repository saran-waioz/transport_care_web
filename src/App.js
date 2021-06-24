import Routes from "./router/router";
import "antd/dist/antd.css";
import Admin from './pages/login/login'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin">
          <Admin />
        </Route>
        <Route path="/">
          <Routes />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
