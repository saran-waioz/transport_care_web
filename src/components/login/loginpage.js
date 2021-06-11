import Login from "./login"
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './globalstyle';
import theme from './index'

const Loginpage=()=>{
    return(
        <>
        <ThemeProvider theme={theme}>
          <GlobalStyles/>
          <Login/>
        </ThemeProvider>
        </>
    )
}
export default Loginpage