const User = require("../models/user")
const moment = require('moment');
const commonHelper = require('../helpers/commonhelpers')
const _ = require("lodash");
const util = require("util");


exports.sign_up = async (req, res, next) => {
    var requests = req.bodyParams
    console.log(req.files)
    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone, email: requests.email });
    if (checkUser) {
        if (checkUser.phone) {
            return res.apiResponse(false, "Mobile Number already eruku.")
        }
        else {
            if (requests.email) {
                var checkUseremail = await User.findOne({ role: requests.role, email: requests.email });
            }
            else {
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
                User.findById(checkUser._id, function (err, userDetails) {
                    for (var k in requests) {
                        if (requests.hasOwnProperty(k)) {
                            userDetails[k] = requests[k];
                        }
                    }
                    var user_detail = userDetails;
                    userDetails.save(function (err) {
                        return res.apiResponse(true, "User Updated Successfully", { user_detail })
                    });
                });
            }
        }
    }
    else {
        if (requests.email) {
            var checkUseremail = await User.findOne({ role: requests.role, email: requests.email });
        }
        else {
            var checkUseremail = false;
        }
        if (checkUseremail) {
            return res.apiResponse(false, "Email already eruku.")
        }
        else {
            let location = {
                type: "Point",
                coordinates: [0, 0]
            }
            requests.location = location;
            var newUser = new User(requests);
            await newUser.save(function (err) {
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
                    return res.apiResponse(true, "Thanks for Transport_care Registration, will notify you once it's launched", { user_detail })
                }
            });
        }
    }
}
exports.sign_in = async (req, res, next) => {
    var requests = req.bodyParams

    if (requests.email && requests.email != "") {
        var user_detail = await User.findOne({ email: requests.email }).populate(['store_detail', 'category_id']);
        console.log(user_detail)
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
            return res.apiResponse(true, "Logged In Successfully", { user_detail })
        }
        else {
            return res.apiResponse(false, "Invalid Password")
        }
    }
}
exports.sent_otp = async (req, res, next) => {

    var requests = req.bodyParams
    console.log(requests)

    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone });
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
            location: location
        });
        newUser.save();
        var data = {};
        data.otp = parseInt(otp);
        return res.apiResponse(true, "Successfully OTP Sent", data)
    }
}
exports.update_otp = async (req, res, next) => {
    var requests = req.bodyParams
    var data = {};
    var checkUser = await User.findOne({ role: requests.role, phone: requests.phone, verify_code: requests.verify_code });
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
                data.user_detail = checkUser;
                data.type = "oldUser";
            }
            else {
                data.type = "newUser";
            }
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
            return res.apiResponse(true, "Document Uploaded Successful");
        } catch (e) {
            return res.apiResponse(false, e.message)
        }
    }
    else{
        return res.apiResponse(false, "Invalid file")
    }
}

