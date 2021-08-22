// grab the things we need
const mongoose = require('mongoose');
const moment = require('moment-timezone')
const commonHelper = require('../helpers/commonhelpers');
const crypto = require("crypto");
var mongoosePaginate = require('mongoose-paginate-v2');
const dotenv = require('dotenv');
dotenv.config();
mongoose.set('useFindAndModify', false);

//create schemaOptions
var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
    timestamps: true
};
/**
 * User schema
 */
const userSchema = new mongoose.Schema({
    role: Number, // 1 - User, 2 - Driver, 3 - caregiver
    name: String,
    email: String,
    phone: String,
    country_code: String,
    password: String,
    dob:{
        type:Date,
        default:Date.now
    },
    age:{
        type:String,
        default:"19"
    },
    gender:{
        type:String,
        default:'Male'
    },
    salt: String,
    profession: {
        type:String,
        default:"Physiotherapist"
    },
    location: {
        type: { type: String },
        coordinates: []
    },
    bearing: {
        type: String,
        default: "0"
    },
    status: {
        type: String,
        default: 'active'
    },
     //role 1,2 active, inactive & role 3  pending,intervied,trained,approved,rejected
    driver_status: {
        type: String,
        default: 'pending'
    },
  
    // Default ride type & vehicle category
    default_service_type: {
        type:String,
        default:'Door to Door'
    },
    default_category_id: String,
    category_id: String,

    //only for driver
    availability_status: String,
    user_rating: {
        type: String,
        default: "0"
    },

    verify_code: String,  //otp
    device_id: Array,
    last_verified: Date,
    reset_password_status:{
        type:Boolean,
        default:false
    },
    reset_password_token: String,
    reset_password_expires: Date,
    email_verify_token: String,
    email_verify_expires: Date,
    phone_verify: {
        type: Number,
        default: 0
    },
    message:String,
    // Driver vehicle details
    vehicle_rc_document: String,
    vehicle_insurance_document: String,
    vehicle_make: String,
    vehicle_model: String,
    vehicle_color: String,
    vehicle_number: String,
    wallet_amount:String,
    // Driver attender details
    is_attender: String,//yes or no
    attender_age: String,
    attender_gender: String,
    attender_name: String,
    //
    driver_license: String,
    profile_image: String,
    attender_proof: String,
    //
    // only for drivers
    trip_status: {
        type: String,
        default: "offline"
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
}, schemaOptions);

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
    }
    return password;
};
// on every save, add the date
userSchema.pre('save', function (next) {
    if (this.password) {
        this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

userSchema.virtual('original_vehicle_rc_document').get(function () {
    if (this.vehicle_rc_document) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.vehicle_rc_document;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})
userSchema.virtual('original_vehicle_insurance_document').get(function () {
    if (this.vehicle_insurance_document) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.vehicle_insurance_document;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})

userSchema.virtual('original_profile_image').get(function () {
    if (this.profile_image) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.profile_image;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})
userSchema.virtual('original_driver_license').get(function () {
    if (this.driver_license) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.driver_license;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})
userSchema.virtual('original_attender_proof').get(function () {
    if (this.attender_proof) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.attender_proof;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})
/**
 * Create instance method for authenticating user
 */
 
userSchema.virtual('driver_status_detail', {
    ref : 'Log',
    localField : '_id',
    foreignField : 'user_id',
    justOne : false
});
userSchema.virtual('default_category_detail', {
    ref : 'Category',
    localField : 'default_category_id',
    foreignField : '_id',
    justOne : true
});
userSchema.virtual('category_detail', {
    ref : 'Category',
    localField : 'category_id',
    foreignField : '_id',
    justOne : true
});

userSchema.methods.comparePassword = function (password) {
    return this.password === this.hashPassword(password);
};
//Virtuals  - basically used for appends, these virutals commes when calling data using schema

userSchema.index({ location: "2dsphere" });
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);