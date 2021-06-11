import {API} from '../../backendserverapi'
import axios from 'axios'

 const Apicall=async(params,url)=>{
    const data = JSON.stringify({
         params
      });  
      const config = {
        method: 'post',
        url: `${API}${url}`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Basic YWRtaW46MTIzNDU2'
        },
        data : data
      };
      const response=await axios(config)
      //console.log(response)
      return response
}
export default Apicall