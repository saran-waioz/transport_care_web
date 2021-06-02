import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './component/login/globalstyle';
import theme from './component/theme/index'
import { useRoutes } from 'hookrouter';
import routes from './routes';
import "./App.css"
const App=()=>{
  const routing=useRoutes(routes)
  return(
    <>
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      {routing}
    </ThemeProvider>
    </>
  )
}
export default App

