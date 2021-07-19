const User = require("../models/user")
const Admin=require("../models/admin")
const moment = require('moment');
const crypto = require("crypto");
const nodemailer = require('../config/nodemailer');
const commonHelper = require('../helpers/commonhelpers')
const _ = require("lodash");
const util = require("util");
const { request } = require("http");
const Attender = require("../models/attender");


exports.sign_up = async (req, res, next) => {
    var requests = req.bodyParams
    var page_status = 0;

    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone,country_code:requests.country_code});
    if (checkUser) {
        return res.apiResponse(false, "Mobile number already exists, sign in to continue");
    }
    else {
        if (requests.email) {
            var checkUseremail = await User.findOne({ role: requests.role, email: requests.email });
        }
        else {
            var checkUseremail = false;
        }
        if (checkUseremail) {
            return res.apiResponse(false, "Email already exists, sign in to continue")
        }
        else {
            let location = {
                type: "Point",
                coordinates: [0, 0]
            }
            requests.location = location;
            console.log(requests.password,"password")
            var newUser = new User(requests);
            await newUser.save(async function (err) {
                if (err) {
                    return res.apiResponse(false, 'Error')
                }
                else {
                    var user_detail = newUser;
                    if (requests.device_id) {
                        var push = {
                            device_id: requests.device_id
                        }
                        var update = {
                            "$addToSet": push
                        }
                        User.findOneAndUpdate({ "_id": newUser._id }, update, { new: true })
                    }
                    if(requests.is_attender == 'yes') {
                        var driver_detail = {
                            driver_id: newUser._id,
                            name: requests.attender_name,
                            age: requests.attender_age,
                            gender: requests.attender_gender
                        };
                        var newAttender = new Attender(driver_detail);
                        await newAttender.save();
                    }
                    if(requests.phone) {
                        var otp = (requests.phone == '9876543210') ? '1234' : Math.floor(1000 + Math.random() * 9000);
                        var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
                        commonHelper.sendSms(requests.phone, smsMessage);
                        var update = {}
                        update.verify_code = otp;
                        User.findOneAndUpdate({ "_id": newUser._id }, update, { new: true }).exec();
                        var data = {};
                        otp = parseInt(otp);
                        //return res.apiResponse(true, "Successfully OTP Sent", data)
                    }
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
                        else if((!user_detail.vehicle_rc_document && !user_detail.vehicle_insurance_document) || user_detail.vehicle_rc_document === undefined || user_detail.vehicle_insurance_document === undefined) {
                            page_status = 3;
                        }
                        else if(!user_detail.driver_license || user_detail.driver_license === undefined) {
                            page_status = 4;
                        }
                        else {
                            page_status = 5;
                        }
                    }
                    return res.apiResponse(true, "Thanks for Transport_care Registration, will notify you once it's launched", { otp, user_detail, page_status })
                }
            });
        }    
    }
}


exports.sign_in = async (req, res, next) => {
    var requests = req.bodyParams
    var page_status = 0;
    if (requests.email && requests.email != "") {
        var user_detail = await User.findOne({ email: requests.email }).populate(['store_detail', 'category_id']);
    }
    else {
        var user_detail = await User.findOne({ role: requests.role, phone: requests.phone }).populate(['store_detail', 'category_id']);
    }

    if (!user_detail) {
        return res.apiResponse(false, "User does not exists")
    }
    else {
        if (user_detail.comparePassword(requests.password)) {
            if (requests.device_id) {
                var push = {
                    device_id: requests.device_id
                }
                var update = {
                    "$addToSet": push
                }
                User.findOneAndUpdate({ "_id": user_detail._id }, update, { new: true }).exec()
                
            }
            if(user_detail.phone_verify === 0) {
                if(user_detail.phone) {
                    var otp = (user_detail.phone == '9876543210') ? '1234' : Math.floor(1000 + Math.random() * 9000);
                    var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
                    commonHelper.sendSms(user_detail.phone, smsMessage);
                    var update = {}
                    update.verify_code = otp;
                    User.findOneAndUpdate({ "_id": user_detail._id }, update, { new: true }).exec();
                    var data = {};
                    otp = parseInt(otp);
                    //return res.apiResponse(true, "Successfully OTP Sent", data)
                }
                page_status = 1 // otp 
            }
            if(user_detail.role === 2) {
                if(user_detail.phone_verify === 0) {
                    page_status = 1;
                }
                else if(!user_detail.vehicle_make || user_detail.vehicle_make === undefined || user_detail.vehicle_make === null) {
                    page_status = 2;
                }
                else if((!user_detail.vehicle_rc_document && !user_detail.vehicle_insurance_document) || user_detail.vehicle_rc_document === undefined || user_detail.vehicle_insurance_document === undefined) {
                    page_status = 3;
                }
                else if(!user_detail.driver_license || user_detail.driver_license === undefined) {
                    page_status = 4;
                }
                else {
                    page_status = 5;
                }
            }
            return res.apiResponse(true, "Logged In Successfully", { otp, user_detail, page_status })
        }
        else {
            return res.apiResponse(false, "Invalid Password")
        }
    }
}

exports.update_user = async (req, res, next) => {
    var requests = req.bodyParams
    var page_status = 0;
    console.log(req.files)
    var checkUser = await User.findOne({ _id: requests.id });
    if (checkUser) {
        var mail_data = {}
        mail_data.user_name = requests.name;
        mail_data.site_name = commonHelper.siteName();
        mail_data.site_url = commonHelper.getBaseurl();
        if (requests.device_id) {
            var push = {
                device_id: requests.device_id
            }
            var update = {
                "$addToSet": push
            }
            User.findOneAndUpdate({ "_id": checkUser._id }, update, { new: true })
        }
        if(requests.is_attender == 'yes' && requests.attender_name != undefined) {
            console.log("is_attender");
            var old_detail = await Attender.findOne({ "driver_id": checkUser._id, "name": requests.attender_name });
                if(!old_detail) {
                    var driver_detail = {
                        driver_id: checkUser._id,
                        name: requests.attender_name,
                        age: requests.attender_age,
                        gender: requests.attender_gender
                    };
                    var newAttender = new Attender(driver_detail);
                    await newAttender.save();
                    console.log("Value inserted");
                }
        }
        User.findById(checkUser._id, function (err, userDetails) {
            for (var k in requests) {
                if (requests.hasOwnProperty(k)) {
                    userDetails[k] = requests[k];
                }
            }
            var user_detail = userDetails;
            userDetails.save(function (err) {
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
                else if((!user_detail.vehicle_rc_document && !user_detail.vehicle_insurance_document) || user_detail.vehicle_rc_document === undefined || user_detail.vehicle_insurance_document === undefined) {
                    page_status = 3;
                }
                else if(!user_detail.driver_license || user_detail.driver_license === undefined) {
                    page_status = 4;
                }
                else {
                    page_status = 5;
                }
            }
            console.log(typeof user_detail.vehicle_insurance_document);
            return res.apiResponse(true, "User Updated Successfully", { user_detail, page_status })
            });
        }).populate(['driver_status_detail']);
    }
    else {
        return res.apiResponse(false, "User is not exists");
    }
}

exports.sent_otp = async (req, res, next) => {

    var requests = req.bodyParams
    console.log(requests)

    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone ,country_code:requests.country_code});
    console.log(checkUser)
    if (checkUser) {
        var verify_code = checkUser.verify_code;
        var last_verified = moment(checkUser.last_verified);
        var current_time = moment();
        if (verify_code == "" || verify_code === undefined) {
            var otp = (requests.phone == '9876543210') ? '1234' : Math.floor(1000 + Math.random() * 9000);
            var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
            commonHelper.sendSms(requests.phone, smsMessage);
            var update = {}
            update.verify_code = otp;
            update.last_verified = current_time;
            await User.findOneAndUpdate({ "_id": checkUser._id }, update, { new: true }).exec()
        }
        else {
            var difference = current_time.diff(last_verified, 'minutes'); // find minutes difference from now and last verifed
            if (difference <= 15) {
                var otp = verify_code;
                var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
                commonHelper.sendSms(requests.phone, smsMessage);
            }
            else {
                var otp = (requests.phone == '9876543210') ? '1234' : Math.floor(1000 + Math.random() * 9000);
                var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
                commonHelper.sendSms(requests.phone, smsMessage);
                var update = {}
                update.verify_code = otp;
                update.last_verified = current_time;
                await User.findOneAndUpdate({ "_id": checkUser._id }, update, { new: true }).exec()
            }
        }
        var data = {};
        data.otp = parseInt(otp);
        return res.apiResponse(true, "Successfully OTP Sent", data)
    }
    else {
        var otp = (requests.phone == '9876543210') ? '1234' : Math.floor(1000 + Math.random() * 9000);
        var smsMessage = otp + " is your " + commonHelper.siteName() + " OTP to login";
        commonHelper.sendSms(requests.phone, smsMessage);
        // create a new user called newUser
        let location = {
            type: "Point",
            coordinates: [0, 0]
        }
        var newUser = new User({
            verify_code: otp,
            last_verified: moment(),
            role: requests.role,
            phone: requests.phone,
            country_code: requests.country_code,
            location: location
        });
        newUser.save();
        var data = {};
        data.otp = parseInt(otp);
        return res.apiResponse(true, "Successfully OTP Sent", data)
    }
}

exports.update_otp = async (req, res, next) => {
    var requests = req.bodyParams;
    var page_status = 0; // home
    var data = {};
    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone, verify_code: requests.verify_code,country_code:requests.country_code });
    if (checkUser) {
        var set = {
            phone_verify: 1
        }
        var update = {
            "$set": set
        }
        if (requests.device_id) {
            var push = {
                device_id: requests.device_id
            }
            var update = {
                "$set": set,
                "$addToSet": push
            }
        }
        User.findOneAndUpdate({ "_id": checkUser._id }, update, { new: true }).exec(function (err, user_detail) {
            if (checkUser.email) {
                //data.user_detail = checkUser;
                data.user_detail = user_detail;
                data.type = "oldUser";
            }
            else {
                data.type = "newUser";
            }
            if(user_detail.phone_verify === 0) {
                page_status = 1 // otp 
            }
            if(user_detail.role === 2) {
                if(user_detail.phone_verify === 0) {
                    page_status = 1
                }
                else if(!user_detail.vehicle_make || user_detail.vehicle_make === undefined || user_detail.vehicle_make === null) {
                    page_status = 2;
                }
                else if((!user_detail.vehicle_rc_document && !user_detail.vehicle_insurance_document) || user_detail.vehicle_rc_document === undefined || user_detail.vehicle_insurance_document === undefined) {
                    page_status = 3;
                }
                else if(!user_detail.driver_license || user_detail.driver_license === undefined) {
                    page_status = 4;
                }
                else {
                    page_status = 5;
                }
            }
            data.page_status = page_status;
            //var updated_data = await User.findOne({ "_id": checkUser._id})
            return res.apiResponse(true, "newUser", data)
        });
    }
    else {
        return res.apiResponse(false, "Incorrect code")
    }
}

exports.upload_document = async (req, res, next) => {
    var requests = req.bodyParams
    if (req.files) {
        const media = req.files.file;
        const fileMove = util.promisify(media.mv)
        const path = 'media/assets/uploads/';       
        const ext = media.name.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const iconName = 'document' + requests.user_id + moment().unix() + '.' + ext
        try {
            await fileMove(path + iconName)
            var update_data = {};
            update_data[requests.document_type] = iconName;
            await User.findOneAndUpdate({ "_id": requests.user_id}, { "$set": update_data }).exec();
            var document = await User.findOne({ "_id": requests.user_id });
            var document_url = commonHelper.getBaseurl() + "/media/assets/uploads/" + document[requests.document_type];
            console.log(document_url);
            return res.apiResponse(true, "Document Uploaded Successful", {document_url} );
        } catch (e) {
            return res.apiResponse(false, e.message)
        }
    }
    else{
        return res.apiResponse(false, "Invalid file")
    }
}

exports.createDefaultAdminuser = async (req, res, next) => {
    var super_admin_data = {
        role:0,
        email:'admin@gmail.com',
        password:'123'
    }
    let location = {
        type: "Point",
        coordinates: [0,0]
    }
    super_admin_data.location = location;
    var newUser = new Admin(super_admin_data);
    await newUser.save()   
    return res.apiResponse(true, "Super Admin Created",newUser);
}
exports.adminlogin = async (req, res, next) => {
    const requests = req.bodyParams;
    const adminRowFromDB = await Admin.findOne({email: requests.email, password: requests.password});
    if (adminRowFromDB){
        return res.apiResponse(true, "Logged in", adminRowFromDB)
    } else {
        return res.apiResponse(false, "User name password wrong")
    }
}
exports.forgotPassword = async(req, res, next) => {
    var requests=req.bodyParams

    var user=await User.findOne({ role: requests.role, email : requests.email });

    if (!user) {
        return res.apiResponse(false, "Email does not exists") 
    }
    else 
    { 
        var token = crypto.randomBytes(3).toString('hex');
        var mail_data = {}
        mail_data.user_name=user.name;
        mail_data.site_name=commonHelper.siteName();
        mail_data.site_url=commonHelper.getBaseurl();
        mail_data.new_password = token;
        nodemailer.sendMail({'to':requests.email,'slug':'forgot_password','data':mail_data});
        user.password=token;
        await user.save();
        return res.apiResponse(true, "Reset password link sent to your email",token)
    }
}


