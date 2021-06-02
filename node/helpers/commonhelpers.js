const env=process.env
const fs =require('fs')

//sitename
exports.siteName=()=>{
    return process.env.APP_NAME;
}
//sendsms
exports.sendSms=async(to,text)=>{
    var sms_id=process.env.SMS_ID
    var sms_url=process.env.SMS_URL
    var sms_user=process.env.SMS_USER
    var sms_pass=process.env.SMS_PASS
    text=text+" _ Transport Care";

    if(sms_id !="" && to !="9876543210"){
        var username=encodeURI(sms_user);
        var password=encodeURI(sms_pass);
        var message=encodeURI(text)
        var sender=encodeURI(sms_id)
        var mobile_number=to;
        var url=sms_url+"?user"+username+"&password"+password+"&mobile"+mobile_number+"&message="+message+"&sender"+sender+"&type"+encodeURI(3);   
    }
    else{
        console.log("Kindly configure you sms services in admin panel")
    }
}
exports.getBaseurl = () =>{
    return env.APP_URL;
}
exports.getSiteurl = () => {
  return env.SITE_URL;
}
exports.siteUrl = () =>{
    return "localhost";
}
exports.prepareUploadFolder = (path) => {
    const pathExist = fs.existsSync (path)
    if (!pathExist) {
      fs.mkdirSync(path, {
        recursive: true
      })
    }
  }
