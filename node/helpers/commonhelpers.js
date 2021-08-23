const env = process.env;
const fs = require("fs");
const User = require("../models/user");
var nodemailer = require('nodemailer');

//sitename
exports.siteName = () => {
  return process.env.APP_NAME;
};


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_ENDPOINT,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_PASSWORD
  }
});


const static_mail_template = (type, data) => {
  let { otp, msg, link } = data
  switch (type) {
    case "welcome":
      return {
        subject: "Transport Care Your Registration Success ✔",
        text: "Registration Success",
        html: `<b>welcome to  transport care, your transport car registration has been succeeded</b>`
      }
      case "trip_summary":
        return {
          subject: "Transport Care Trip Summary ✔",
          text: "Your transport care trip summary.",
          html: `<b>Your transport care trip as completed,</br> Your Transport Care Trip summary : </b>`
        }
      case "booking_confirmation":
        return {
          subject: "Transport Care Booking Confirmation ✔",
          text: "Your booking has been confirmed !",
          html: `<b>Your booking transport care booking has been Confirmed </b>`
        }
    default:
      return {
        subject: "Transport Care ✔",
        text: "Thanks for using Transport Care",
        html: `<b>Thank's for using Transport Care </b>`
      }
  }

}

module.exports.send_mail_nodemailer = async (email, type, datas) => {
  try {

    let email_temp = await static_mail_template(type, datas)
    const mail_msg = {
      to: email,
      from:  process.env.SMTP_SENDER_ADDRESS,
      ...email_temp
    };
    console.log("processing email",mail_msg)
    transporter.sendMail(mail_msg, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });;
    return true
  } catch (error) {
    console.log("module.exports.send_mail_sendgrid -> error", error)
    return false
  }
}



// send sms via twilio
exports.sendSms = async (to,country_code, text) => {
  try{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    var sender =  process.env.TWILIO_SMS_ID;
    const client = require("twilio")(accountSid, authToken);
  
    var message = `${text} _ Transport Care`; 
    country_code = country_code || 65
    var mobile_number = to;
    if(to && message){
      client.messages
      .create({body: message, from: sender, to: `+${country_code}${mobile_number}`})
      .then(message => console.log(message.sid,"twilio api"))
      .catch(error => console.log(error,"twilio api error"))
    }else{
      console.log("Kindly please send to number and messages");
    }
  }catch(error){
    console.log("Kindly configure you sms services in admin panel");
  }
};

//sendsms
exports.sendSms_testing = async (to, text) => {
  var sms_id = process.env.SMS_ID;
  var sms_url = process.env.SMS_URL;
  var sms_user = process.env.SMS_USER;
  var sms_pass = process.env.SMS_PASS;
  text = text + " _ Transport Care";

  if (sms_id != "" && to != "9876543210") {
    var username = encodeURI(sms_user);
    var password = encodeURI(sms_pass);
    var message = encodeURI(text);
    var sender = encodeURI(sms_id);
    var mobile_number = to;
    var url1 = `${sms_url}?user${username}&password${password}&mobile${mobile_number}&message=${message}&sender${sender}&type${encodeURI(3)}`;
    console.log(url)
    console.log(url1)
  } else {
    console.log("Kindly configure you sms services in admin panel");
  }
};
exports.get_page_status = async (user_detail) => {
  var page_status = 0;
  if (user_detail) {
    if (user_detail.phone_verify === 0) {
      page_status = 1; // otp
    }
    if (user_detail.role === 2) {
      if (user_detail.phone_verify === 0) {
        page_status = 1;
      } else if (
        !user_detail.vehicle_make ||
        user_detail.vehicle_make === undefined ||
        user_detail.vehicle_make === null
      ) {
        page_status = 2;
      } else if (
        !user_detail.vehicle_rc_document ||
        !user_detail.vehicle_insurance_document ||
        user_detail.vehicle_rc_document === undefined ||
        user_detail.vehicle_insurance_document === undefined
      ) {
        page_status = 3;
      } else if (
        !user_detail.driver_license ||
        !user_detail.attender_proof ||
        user_detail.driver_license === undefined ||
        user_detail.attender_proof === undefined
      ) {
        page_status = 4;
      } else if (user_detail.driver_status != "approved") {
        page_status = 5;
      }
    }
    if (user_detail.reset_password_status) {
      page_status = 6; // attempting forgot password
    }
  }
  return page_status;
};
exports.getBaseurl = () => {
  return env.APP_URL;
};
exports.getSiteurl = () => {
  return env.SITE_URL;
};
exports.siteUrl = () => {
  return "localhost";
};
exports.prepareUploadFolder = (path) => {
  const pathExist = fs.existsSync(path);
  if (!pathExist) {
    fs.mkdirSync(path, {
      recursive: true,
    });
  }
};

function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != "object") return obj;
  return Object.keys(obj).reduce(
    function (acc, key) {
      acc[key.trim()] =
        typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}
exports.trimObjc = (obj) => {
  return trimObj(obj);
};
