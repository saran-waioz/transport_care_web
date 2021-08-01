const env=process.env
const fs =require('fs')
const User = require("../models/user")

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
exports.get_page_status=async(user_detail)=>{
  var page_status = 0;
  if(user_detail)
  {
    if(user_detail.phone_verify === 0) {
        page_status = 1 // otp 
    }
    if(user_detail.role === 2) {
      if(user_detail.phone_verify === 0) {
          page_status = 1;
      }
      else if(!user_detail.vehicle_make || user_detail.vehicle_make === undefined || user_detail.vehicle_make === null) {
          page_status = 2;
      }
      else if((!user_detail.vehicle_rc_document || !user_detail.vehicle_insurance_document) || ( user_detail.vehicle_rc_document === undefined || user_detail.vehicle_insurance_document === undefined )) {
          page_status = 3;
      }
      else if((!user_detail.driver_license || !user_detail.attender_proof ) || ( user_detail.driver_license === undefined || user_detail.attender_proof === undefined )) {
          page_status = 4;
      }
      else if(user_detail.driver_status != 'approved'){
          page_status = 5;
      }
    }
    if(user_detail.reset_password_status) {
      page_status = 6 // attempting forgot password 
    }
  }
  return page_status;
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

  
  function trimObj(obj)
  {
    if (!Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function(acc, key) {
      acc[key.trim()] = typeof obj[key] == 'string'? obj[key].trim() : trimObj(obj[key]);
      return acc;
    }, Array.isArray(obj)? []:{});
  }
  exports.trimObjc = (obj) => {
    return trimObj(obj)
  }
