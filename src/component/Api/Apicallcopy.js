import {API} from '../../backendserverapi'
import axios from 'axios'

 const Apicallcopy=async(params,url)=>{ 
      const config = {
        method: 'post',
        url: `${API}${url}`,
        headers: { 
          "content-type": "multipart/form-data"  ,    
           'Authorization': 'Basic YWRtaW46MTIzNDU2'
        },
        data : params
      };
      const response=await axios(config)
      //console.log(response)
      return response
}
export default Apicallcopy