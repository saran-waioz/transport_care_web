import Login from './component/login/login'
import Register from "./component/login/register"

const routes={
    '/admin':()=><Login/>,
    '/admin/register':()=><Register/>,
}

export default routes