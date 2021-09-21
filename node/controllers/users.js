var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectID;
const commonHelper=require('../helpers/commonhelpers')
const User = require("../models/user");
const StripeCards = require("../models/stripe_cards");
const Log = require("../models/log");
const Firebase = require("../config/firebase");
const moment = require("moment");
const _ = require("lodash");
const UserCareGiver = require("../models/user_caregiver");
const Attender = require("../models/attender");
const Feedback = require("../models/feedback");
const Trip = require("../models/trip_details");
const TransactionModel = require("../models/transaction");
const RequestDetail = require("../models/request_details");
const Rating = require("../models/rating");
const Category = require("../models/category");
const distance = require("google-distance");
const Agenda = require("../agenda");
const geolib = require('geolib');
const { RequestResponseStatusCode } = require("nexmo");
const { request } = require("express");
const stripe = require('stripe')('sk_test_51JOl26GwzlPF3YojClmory2WxpKjuUsQZMTJJtvaYbZ6oDeitr0mOsDsrokLCy2zoN2dmlTbrvDq4cwu8r4F8aZ800Xf3bpd84');


exports.get_reviews = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1;
  var per_page = requests.per_page || 10;
  const options = {
    page: page,
    limit: per_page,
    collation: { locale: "en" },
    sort: { createdAt: -1 },
    populate:['trip_detail']
  };
  const match = {
  };
  if(requests.is_deleted){
    match['is_deleted']=true;
  }
  if (typeof requests.search != "undefined" && requests.search.trim() != "") {
    var trip_ids = await Trip.find({invoice_id: requests.search }).distinct('_id');
    match['trip_id']={$in:trip_ids}
  }

  Rating.paginate(match, options, function (err, result) {
    return res.apiResponse(true, "Success", result);
  });
};
exports.get_users = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1;
  var per_page = requests.per_page || 10;
  const options = {
    page: page,
    limit: per_page,
    collation: { locale: "en" },
    sort: { createdAt: -1 },
  };
  const match = {
    role: requests.role,
    is_deleted: false,
  };
  if(requests.is_deleted){
    match['is_deleted']=true;
  }
  if (typeof requests.search != "undefined" && requests.search != "") {
    match.$or = [
      { name: { $regex: ".*" + requests.search + ".*", $options: "i" } },
      { email: { $regex: ".*" + requests.search + ".*", $options: "i" } },
      { phone: { $regex: ".*" + requests.search + ".*", $options: "i" } },
    ];
  }
  if (requests.sort && typeof requests.sort != "undefined") {
    var sort = requests.sort.split(",");
    if (sort[0] == "status") {
      if (sort[1] == 1) {
        match.status = "Active";
      } else {
        match.status = { $ne: "Active" };
      }
    } else {
      var sort_option = {};
      sort_option[sort[0]] = sort[1];
      options.sort = sort_option;
    }
  } else {
    var sort_option = {};
    sort_option["createdAt"] = "desc";
    options.sort = sort_option;
  }

  User.paginate(match, options, function (err, result) {
    return res.apiResponse(true, "Success", result);
  });
};
exports.get_export_user = async (req, res) => {
  var requests = req.bodyParams;
  const match = {
    role: requests.role,
  };
  if (requests.active_user) {
    match["active_user"] = requests.active_user;
  }
  User.find(match, function (err, result) {
    if (requests.select) {
      result = _.map(
        result,
        _.partial(_.ary(_.pick, 3), _, requests.select.split(","))
      );
    }
    return res.apiResponse(true, "Success", result);
  }).populate(["store_detail"]);
};
async function initiate_driver_payout(user_detail,trip_detail)
{
  let current_user_wallet = 0
  if(user_detail.wallet_amount && user_detail.wallet_amount !== 'NaN'){
    current_user_wallet = user_detail.wallet_amount 
  }  
  
  user_detail.wallet_amount = Number(parseFloat(current_user_wallet) + parseFloat(trip_detail.price_detail.driver_payout)).toFixed(2);
  await user_detail.save();
  var transaction_data = {}
  transaction_data.amount = parseFloat(trip_detail.price_detail.driver_payout).toFixed(2);
  transaction_data.orginal_amount = parseFloat(trip_detail.price_detail.driver_payout).toFixed(2);
  transaction_data.user_id = user_detail._id;
  transaction_data.type = 'driver_payout';
  transaction_data.transaction_id = trip_detail.id;
  transaction_data.payment_type = 'wallet_payment';
  transaction_data.status = 'completed';
  let transactions = new TransactionModel(transaction_data);
  await transactions.save();
}
async function get_default_category(user_detail,category_list) {
  if(!user_detail.default_category_id && category_list.length)
  {
    await User.findOneAndUpdate({ _id: user_detail.id},
      { $set: 
        {
        'default_category_id': category_list[0]._id
        }  
      },
      { new: true },(err, doc, raw) => { 
        return category_list[0]._id
      }).exec();
  }
  else
  {
    return user_detail.default_category_id
  }
}
exports.get_wallet_data = async (req, res) => {
  var requests = req.bodyParams;
  var user_detail = await User.findOne({ _id: requests.user_id });
  var match={ user_id: requests.user_id }
  match = {$and:
    [
    { user_id: requests.user_id },
    {
      $or:[{type:'wallet'},{payment_type:'wallet_payment'}]
    }
    ]}
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const myCustomLabels = {
    totalDocs: 'totalDocs',
    docs: 'wallet_history',
    limit: 'limit',
    page: 'page',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'pagingCounter'
  };
  const options = {
    page: page,
    limit: per_page,
    customLabels:myCustomLabels
  };
  var payout_card = await StripeCards.find({card_type:'external',user_id:requests.user_id});
  if (pagination == "true") {
    TransactionModel.paginate(match, options, function (err, wallet_history) {
        var wallet_details={}
        wallet_details.wallet_amount = user_detail.wallet_amount
        wallet_details.received_wallet = user_detail.received_wallet
        wallet_details.payout_card = payout_card
        const c = Object.assign({}, wallet_history, {wallet_details});
        return res.apiResponse(true, "Success", c )
    });
  }
  else {
    var wallet_history = await TransactionModel.find(match);
    var wallet_details={}
    wallet_details.wallet_amount = user_detail.wallet_amount
    wallet_details.received_wallet = user_detail.received_wallet
    wallet_details.wallet_history = wallet_history
    wallet_details.payout_card = payout_card
    return res.apiResponse(true, "Success", wallet_details)
  }
}
exports.get_driver_status = async (req, res) => {
  var requests = req.bodyParams;
  var user_detail = await User.findOne({ _id: requests.id }).populate([{path:'driver_status_detail',match:{type:'status'}}]);
  if(user_detail)
  {
    var driver_status_detail = user_detail.driver_status_detail;
    return res.apiResponse(true, "Success",{driver_status_detail});

  }
  else
  {
    return res.apiResponse(false, "Invalid User id");
  }
}
exports.get_user_detail = async (req, res) => {
  var requests = req.bodyParams;
  if (
    requests.id &&
    requests.id != "" &&
    requests.id != null &&
    requests.id != "null"
  ) 
  {
    var user_detail = await User.findOne({ _id: requests.id });
    var user_populate = ['default_category_detail']
    if(user_detail.role==2)
    {
      var user_populate = ['category_detail']
    }
    else
    {
      var user_populate = ['default_category_detail']
    }
    var category_list = await Category.find();
    get_default_category(user_detail,category_list).then(async(category_det) => {
      var user_detail = await User.findOne({ _id: requests.id }).populate(user_populate);
      user_detail = JSON.parse(JSON.stringify(user_detail));
      user_detail.default_category_name = (user_detail.role==2)?"":user_detail.default_category_detail.name;
      var service_type = [
        { name: "Door to Door", image: commonHelper.getBaseurl() + "/media/assets/images/door_to_door_image.jpeg", is_care: true }, 
        { name: "Independent Trip", image: commonHelper.getBaseurl() + "/media/assets/images/independent_image.jpeg", is_care: false }, 
        { name: "Caregiver", image: commonHelper.getBaseurl() + "/media/assets/images/caregiver_image.jpeg", is_care: true }
      ];
      var populate=['driver_detail'];
      var trip_details = await Trip.findOne({user_id:requests.id}).populate(populate).limit(1).sort({createdAt:-1});
      var last_trip_detail = {}
      if(trip_details)
      {
        last_trip_detail = {
          id:trip_details._id,
          service_type:trip_details.service_type,
          category_name : trip_details.category_detail.name,
          driver_name:trip_details.driver_detail.name,
          format_date : trip_details.formatted_created_at,
          amount:trip_details.price_detail.total
        }
      }
      return res.apiResponse(true, "Success", { user_detail,service_type,category_list,last_trip_detail });
    })
  } else {
    return res.apiResponse(false, "Invalid User id");
  }
};

exports.delete_user = async (req, res, next) => {
  var requests = req.bodyParams;
  await User.findOneAndUpdate(
    { _id: requests.id },
    { $set: {is_deleted: true} },
  ).exec();
  
  /*await User.findById(requests.id, async (err, user) => {
    if (user) {
      await user.remove();
    }
  });*/

  return res.apiResponse(true, " Deleted Successfully");
};

exports.update_driver_status = async (req, res, next) => {
  if (typeof req.bodyParams == "undefined") {
    var requests = req;
  } else {
    var requests = req.bodyParams;
  }
  var old_user_detail = await User.findOne({ _id: requests.id });
  await User.findOneAndUpdate(
    { _id: requests.id },
    { $set: requests },
    { new: true }
  ).exec();
  var newLog = new Log({
    user_id: requests.id,
    type: "status",
    message: requests.driver_status,
    info: requests.info,
  });
  commonHelper.put_logs(requests.id,"You are updated into " + requests.driver_status + " status");
  newLog.save();
  if (old_user_detail.device_id && old_user_detail.device_id.length) {
    for (let i = 0; i < old_user_detail.device_id.length; ++i) {
      Firebase.singleNotification(
        old_user_detail.device_id[i],
        "Status Updated",
        "You are updated into " + requests.driver_status + " status"
      );
    }
  }
  return res.apiResponse(true, "Status updated Successfully");
};

exports.get_logs = async (req, res, next) => {
  var requests = req.bodyParams;
  var match =  {
    user_id:requests.user_id
  };
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const myCustomLabels = {
    totalDocs: 'totalDocs',
    docs: 'notifications',
    limit: 'limit',
    page: 'page',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'pagingCounter'
  };
  const options = {
    page: page,
    limit: per_page,
    customLabels:myCustomLabels,
    sort:{createdAt:-1}
  };
  if (pagination == "true") {
      Log.paginate(match, options, function (err, notifications) {
          return res.apiResponse(true, "Success", notifications)
      });
  }
  else {
      var notifications = await Log.find(match).sort({createdAt:-1});
      return res.apiResponse(true, "Success", { notifications })
  }
}
// exports.get_pagination = async (req, res, next) => {
//   var requests = req.bodyParams;
//   var match =  {};
//   var role=requests.role||"false"
//   var page = requests.page || 1
//   var per_page = requests.per_page || 10
//   var pagination = requests.pagination || "false"
//   var populate = [];
//   if(requests.id && requests.id!="")
//   {
//       match['_id']=requests.id;
//   }
//   else
//   {
//       if(requests.status && requests.status!="")
//       {
//           match['status']=requests.status
//       }
//   }
//   const options = {
//       role:role,
//       page: page,
//       limit: per_page,
//       populate:populate
//   };
//   if (pagination == "true") {
//       User.paginate(match, options, function (err, blogs) {
//           return res.apiResponse(true, "Success", { blogs })
//       });
//   }
//   else {
//       var blogs = await User.find(match).populate(populate);
//       return res.apiResponse(true, "Success", { blogs })
//   }
// }

exports.get_trips = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = (requests.pagination)?requests.pagination:"false"
  const match = {}
  var populate=['user_detail','caregiver_detail','driver_detail',
  {
    path:'user_rating',
    match:{rating_type:'driver-user'}
  },
  {
    path:'driver_rating',
    match:{rating_type:'user-driver'}
  },
  {
    path:'is_user_rated',
    match:{rating_type:'driver-user'}
  },
  {
    path:'is_driver_rated',
    match:{rating_type:'user-driver'}
  }];
  match['is_deleted'] =  false;
  var sort = { createdAt: -1 }
  if (requests.search && requests.search != "") {
      match.invoice_id = { $regex: new RegExp("^" + requests.search, "i") }
  }

  if (requests.status && requests.status != "") {
    match.trip_status = { $in: requests.status.split(',') }
  }
  if (requests.user_id && requests.user_id != "") {
    match.user_id = requests.user_id
  }
  if (requests.driver_id && requests.driver_id != "") {
    match.driver_id = requests.driver_id
  }
  if (requests.booking_type && requests.booking_type != "") {
    match.booking_type =  requests.booking_type
  }
  if (requests.id && requests.id != "") {
    var trip_detail = await Trip.findOne({_id:requests.id}).populate(populate);
    return res.apiResponse(true, "Success", {trip_detail} )
  }
  else
  {
    const myCustomLabels = {
      totalDocs: 'totalDocs',
      docs: 'trip_details',
      limit: 'limit',
      page: 'page',
      nextPage: 'nextPage',
      prevPage: 'prevPage',
      totalPages: 'totalPages',
      pagingCounter: 'pagingCounter'
    };
    const options = {
      page: page,
      limit: per_page,
      sort: sort,
      customLabels:myCustomLabels,
      populate:populate
    };
    var extra_detail = {
      trips_last_week:"23",
      trips_current_week:"5",
      trips_per_day:"5",
      earnings_last_week:"$85",
      earnings_current_week:"$15",
      earnings_per_day:"$5"
    }
    if (pagination == "true") {
        Trip.paginate(match, options, function (err, trip_details) {
          const c = Object.assign({}, trip_details, {extra_detail});
            return res.apiResponse(true, "Success", c )
        });
    }
    else {
        var trip_details = await Trip.find(match).sort(sort).populate(populate);
        return res.apiResponse(true, "Success", {trip_details,extra_detail} )
    }
  }
}
exports.get_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const match = {}

  var sort = { createdAt: -1 }
  if (requests.search && requests.search != "") {
      match.name = { $regex: new RegExp("^" + requests.search, "i") }
  }

  const options = {
      page: page,
      limit: per_page,
      sort: sort
  };

  if (typeof requests.role != "undefined" && requests.role != "") {
      match['role'] = requests.role
  }
  if (pagination == "true") {
      User.paginate(match, options, function (err, caregivers) {
          return res.apiResponse(true, "Success", {caregivers} )
      });
  }
  else {
      var caregivers = await User.find(match).sort(sort);
      return res.apiResponse(true, "Success", {caregivers} )
  }

}

exports.add_user_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  if(requests.user_id) {
    var check_user_caregiver = await UserCareGiver.find({ user_id: requests.user_id, care_giver_id: requests.care_giver_id});
    if(check_user_caregiver.length) {
      return res.apiResponse(false, "User can already have an Caregiver");
    }
    else {
      var newCareGiver = new UserCareGiver(requests);
      var added_caregiver = await newCareGiver.save();
      var caregiver = await UserCareGiver.findOne({_id:added_caregiver.id}).populate([
        {
          path: 'caregiver_detail',
        },
        {
          path: 'user_detail',
        }   
      ])
      commonHelper.put_logs(requests.user_id,"New caregiver added "+caregiver.caregiver_detail.name);
      commonHelper.put_logs(requests.care_giver_id,"New undercare added "+caregiver.user_detail.name);
      return res.apiResponse(true, "Record Inserted Successfully", {caregiver})
    }
  }
  else {
    return res.apiResponse(false, "Please Create the User");
  }
}

exports.delete_user_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  await UserCareGiver.findOne({ user_id: requests.user_id, care_giver_id: requests.care_giver_id}, async (err, user_caregiver) => {
    if (user_caregiver) {
      await user_caregiver.remove();
      commonHelper.put_logs(requests.user_id,"Caregiver removed "+caregiver.caregiver_detail.name);
      commonHelper.put_logs(requests.care_giver_id,"Undercare removed "+caregiver.user_detail.name);
    }
  });
  return res.apiResponse(true, "Record Deleted Successfully");
}

exports.get_user_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const match = {}

  var sort = { is_default :-1}
  var populate = [
    {
      path: 'user_detail',
    },
    {
      path: 'caregiver_detail',
    }  
  ];
  const myCustomLabels = {
    totalDocs: 'totalDocs',
    docs: 'caregivers',
    limit: 'limit',
    page: 'page',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPages',
    pagingCounter: 'pagingCounter'
  };
  const options = {
      page: page,
      limit: per_page,
      sort: sort,
      customLabels: myCustomLabels,
      populate: (populate)
  };

  if (typeof requests.user_id != "undefined" && requests.user_id != "") {
      match['user_id'] = requests.user_id
  }
  if (typeof requests.care_giver_id != "undefined" && requests.care_giver_id != "") {
    match['care_giver_id'] = requests.care_giver_id
  }
  if (pagination == "true") {
      UserCareGiver.paginate(match, options, function (err, caregivers) {
          return res.apiResponse(true, "Success", caregivers )
      });
  }
  else {
      var caregivers = await UserCareGiver.find(match).sort(sort).populate(populate);
      return res.apiResponse(true, "Success", {caregivers} )
  }

}

exports.add_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;  
  if(requests.type == "add") {
    var check_user = await User.find({ _id: requests.driver_id, role: 2 });
    if(check_user.length) {
      var get_attender = await Attender.find({driver_id:requests.driver_id});
      if(!get_attender.length)
      {
        requests.is_default = true
      }
      var attender = new Attender(requests);
      await attender.save();
      return res.apiResponse(true, "Record Inserted Successfully",{attender})
    }
  }
  if(requests.type == "update") {
    var old_attender_detail = await Attender.findOne({ _id: requests.id });
    if(old_attender_detail) {
      if(requests.switch)
      {
        Attender.updateOne({"created": false}, {"$set":{"created": true}}, {"multi": true}, (err, writeResult) => {});

        await Attender.update(
          { _id: requests.id },
          { $set: {is_default:false} },
          { new: true },
          (err,attender)=>{
            return res.apiResponse(true, "Record Updated Successfully",{attender});
          }
        ).exec();   
        await Attender.findOneAndUpdate(
          { _id: requests.id },
          { $set: {is_default:true} },
          { new: true },
          (err,attender)=>{
            return res.apiResponse(true, "Record Updated Successfully",{attender});
          }
        ).exec();   
      }
      else
      {
        await Attender.findOneAndUpdate(
          { _id: requests.id },
          { $set: requests },
          { new: true },
          (err,attender)=>{
            return res.apiResponse(true, "Record Updated Successfully",{attender});
          }
        ).exec();      
      }
    }
  }
}

exports.delete_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;
  await Attender.findOne({ _id: requests.id }, async (err, driver_attender) => {
    if (driver_attender) {
      await driver_attender.remove();
    }
  });
  return res.apiResponse(true, "Record Deleted Successfully");
}

exports.get_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const match = {}

  var sort = { createdAt: -1 }
  
  const options = {
      page: page,
      limit: per_page,
      sort: sort,
      populate: ([
        {
          path: 'driver_detail',
        } 
      ])
  };

  if (typeof requests.driver_id != "undefined" && requests.driver_id != "") {
      match['driver_id'] = requests.driver_id
  }
  if (pagination == "true") {
      Attender.paginate(match, options, function (err, attenders) {
          return res.apiResponse(true, "Success", {attenders} )
      });
  }
  else {
      var attenders = await Attender.find(match).sort(sort);
      return res.apiResponse(true, "Success", {attenders} ) 
  }
}

exports.add_user_feedback = async (req, res, next) => {
  var requests = req.bodyParams;

  var check_user = await User.find({ _id: requests.user_id });
  if(check_user.length) {
    var newFeedback = new Feedback(requests);
    await newFeedback.save();
    return res.apiResponse(true, "Record Inserted Successfully", newFeedback._id)
  }
}

exports.update_profile = async (req, res, next) => {
  if (typeof req.bodyParams == "undefined") {
    var requests = req;
  } 
  else {
    var requests = req.bodyParams;
  }

  var old_user_detail = await User.findOne({ _id: requests.id });
  if(old_user_detail) {
    await User.findOneAndUpdate(
      { _id: requests.id },
      { $set: requests },
      { new: true },
      (err,user_detail)=>{
        return res.apiResponse(true, "Record Updated Successfully",{user_detail});
      }
    ).exec();
  }
};

exports.update_availability_status = async (req, res, next) => {
  if (typeof req.bodyParams == "undefined") {
    var requests = req;
  } 
  else {
    var requests = req.bodyParams;
  }

  var old_user_detail = await User.findOne({ _id: requests.id, role: 2 });
  if(old_user_detail) {
    await User.findOneAndUpdate(
      { _id: requests.id },
      { $set: 
        {
          'availability_status': requests.status
        } 
      },
      { new: true }
    ).exec();
    return res.apiResponse(true, "Record Updated Successfully");
  }
  else {
    return res.apiResponse(false, "Driver not Found");
  }
};

exports.get_home_page_details = async (req, res, next) => {
  var requests = req.bodyParams;
  const match = {};
  var service_type = [
    { name: "Door to Door", image: commonHelper.getBaseurl() + "/media/assets/images/door_to_door_image.jpeg", is_care: true }, 
    { name: "Independent Trip", image: commonHelper.getBaseurl() + "/media/assets/images/independent_image.jpeg", is_care: false }, 
    { name: "Caregiver", image: commonHelper.getBaseurl() + "/media/assets/images/caregiver_image.jpeg", is_care: true }
  ];
  var nearby_drivers = [];
  var caregivers = [];
  var trip_populate=['user_detail','caregiver_detail','driver_detail',
  {
    path:'user_rating',
    match:{rating_type:'driver-user'}
  },
  {
    path:'driver_rating',
    match:{rating_type:'user-driver'}
  },
  {
    path:'is_user_rated',
    match:{rating_type:'driver-user'}
  },
  {
    path:'is_driver_rated',
    match:{rating_type:'user-driver'}
  }];
  if (typeof requests.user_id != "undefined" && requests.user_id != "") 
  {
    var user_detail = await User.findOne({_id:requests.user_id});
    if(user_detail.role==1)
    {
      match['user_id'] = requests.user_id;  
    }
    else
    {
      match['care_giver_id'] = requests.user_id;
    }
    
    var origin = requests.current_location.split(",");
    var matches = {
      role: 2,
      status: 'active'
    };
    matches['trip_status'] = 'online';
    matches['is_deleted'] = false;
    matches['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: [origin[1],origin[0]]
            }
        }
    }
    try {
      nearby_drivers = await User.find(matches);

    } catch (error) {
      
    }
    caregivers = await UserCareGiver.find(match).sort({is_default:-1}).populate([
      {
        path: 'caregiver_detail',
      },
      {
        path: 'user_detail',
      }  
    ]);
    var current_trip_detail = await Trip.find({ user_id: requests.user_id, is_deleted: false, trip_status:{$in:['pending', 'arrived','accepted' , 'start_trip', 'end_trip']} }).populate(trip_populate);
  }
  else if (typeof requests.driver_id != "undefined" && requests.driver_id != "") 
  {
    var user_detail = await User.findOne({_id:requests.driver_id});
    var current_trip_detail = await Trip.find({ driver_id: requests.driver_id, is_deleted: false, trip_status:{$in:['pending', 'arrived','accepted' , 'start_trip','end_trip']} }).populate(trip_populate);
  }
  var category_list = await Category.find();

  return res.apiResponse(true, "Success", { category_list,user_detail, caregivers, service_type, current_trip_detail, nearby_drivers });
} 

exports.calculate_fare_estimation = async (req, res, next) => {
  var requests = req.bodyParams;
  var API_KEY = 'AIzaSyCUbgwz5a9IidJRM8QA7Ms3K5ibIKB_B6M';
  var testing = (requests.testing && requests.testing=="false")?false:true;
  var distance_time;
  if(requests.origin) {
    var origin = requests.origin.split(",");
    var match = {
      role: 2,
      status: 'active',
      trip_status: 'online'
    };
    match['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: [origin[1],origin[0]]
            }
        }
    }
    var get_drivers = await User.find(match).distinct('category_id');
    var category_list = await Category.find({ '_id': { $in : get_drivers }});
    category_list = JSON.parse(JSON.stringify(category_list));
    if(testing)
    {
      var distances = {
        "index": null,
        "distance": "16.0 km",
        "distanceValue": 16047,
        "duration": "33 mins",
        "durationValue": 1964,
        "origin": "70A, 5th St, Kalai Nagar, Madurai, Tamil Nadu 625017, India",
        "destination": "8, Rajaji St, Thiru Nagar, Tamil Nadu 625006, India",
        "mode": "driving",
        "units": "metric",
        "language": "en",
        "avoid": null,
        "sensor": false,
        "selected_origin": "9.9619342,78.1266277",
        "selected_destination": "9.8807146,78.0563409"
      }
      for(var i = 0; i < category_list.length; i++) {
        category_list[i].calculated_price = parseFloat(category_list[i].price * (distances.distanceValue/1000)).toFixed(2);
      }
      return res.apiResponse(true, "Success", { distances, category_list } );
    }
    else
    {
      distance.apiKey = API_KEY;
      await distance.get(
        {
          origin: requests.origin,
          destination: requests.destination
        },
        async function(err, distances) {
          if (err) return console.log(err);
          for(var i = 0; i < category_list.length; i++) {
            category_list[i].calculated_price = parseFloat(category_list[i].price * (distances.distanceValue/1000)).toFixed(2);
          }
          distances.selected_origin = requests.origin;
          distances.selected_destination = requests.destination;
          return res.apiResponse(true, "Success", { distances, category_list } );
        }
      );
    }
  }
}

exports.trip_update = async (req, res, next) => {
  var requests = req.bodyParams;
  await Trip.findOneAndUpdate({ _id: requests.id },
    { $set: 
      requests
    },
    { new: true },
    async(err,trip_detail)=>{
      if(err)
      {
        return res.apiResponse(false, "Invalid Data");
      }
      else
      {
        var trip_populate=['user_detail','caregiver_detail','driver_detail',
        {
          path:'user_rating',
          match:{rating_type:'driver-user'}
        },
        {
          path:'driver_rating',
          match:{rating_type:'user-driver'}
        },
        {
          path:'is_user_rated',
          match:{rating_type:'driver-user'}
        },
        {
          path:'is_driver_rated',
          match:{rating_type:'user-driver'}
        }];
        var trip_detail = await Trip.findOne({ _id: trip_detail._id}).populate(trip_populate);
        global.io.in("trip_"+ trip_detail.id).emit('trip_detail', { trip_detail });
        return res.apiResponse(true, "Status Updated Successfully",{ trip_detail });
      }
    }
  ).exec();
}
exports.update_trip_status = async (req, res, next) => {
  var requests = req.bodyParams;
  var old_detail = await Trip.findOne({ _id: requests.trip_id });
  if(old_detail) {
    var update_data={};
    update_data.trip_status = requests.status;
    update_data.is_deleted = false;
    switch (update_data.trip_status) {
      case 'arrived':
        update_data.arrived_at = moment();
        break;
      case 'start_trip':
        update_data.started_at = moment();
        break;
      case 'end_trip':
        update_data.ended_at = moment();
        break;
      case 'completed':
        update_data.completed_at = moment();
        break; 
      case 'cancelled':
        if(requests.type && requests.type!="")
        {
          update_data.cancelled_by = requests.type;
        }
        update_data.cancelled_at = moment();
        break;    
      default:
        break;
    }
    await Trip.findOneAndUpdate({ _id: requests.trip_id },
      { $set: 
        update_data  
      },
      { new: true }
    ).exec();
    
    if(old_detail.driver_id && (requests.status == 'end_trip' || requests.status == 'cancelled')) {
      await User.findOneAndUpdate({ _id: old_detail.driver_id, role: 2 },
      { $set: 
        {
        'trip_status': 'online',
        'current_trip_id':''
        }  
      },
      { new: true },
      (err, doc, raw) => { 
        
      }).exec();
    }
    if(requests.status == 'completed')
    {
      var user_detail = await User.findOne({ _id: old_detail.user_id})
      commonHelper.send_mail_nodemailer(user_detail.email,"booking_confirmation",old_detail);
    }
    var trip_populate=['user_detail','caregiver_detail','driver_detail',
    {
      path:'user_rating',
      match:{rating_type:'driver-user'}
    },
    {
      path:'driver_rating',
      match:{rating_type:'user-driver'}
    },
    {
      path:'is_user_rated',
      match:{rating_type:'driver-user'}
    },
    {
      path:'is_driver_rated',
      match:{rating_type:'user-driver'}
    }];
    var trip_detail = await Trip.findOne({ _id: requests.trip_id}).populate(trip_populate);
    switch (update_data.trip_status) {
      case 'arrived':
        commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Arrived");
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - "+trip_detail.driver_detail.name+" arrived your location");
        break;
      case 'start_trip':
        commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Trip Started");
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Trip Started");
        break;
      case 'end_trip':
        commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Reached Destination");
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Reached Destination");
        break;
      case 'completed':
        commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Trip Completed");
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Trip Completed");
        break; 
      case 'cancelled':
        commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Trip Cancelled");
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Trip Cancelled");
        break;    
      default:
        break;
    }
    await caregiver_push_notifications(trip_detail);
    if(update_data.trip_status === "completed"){
        /**
        * @info send email using through nodemailer after payment *(booking confirmatin)
        */
      let email = ""
      if(Array.isArray(trip_detail.user_detail)){
        email = trip_detail.user_detail[0].email
      }else{
        email = trip_detail.user_detail.email
      }
      commonHelper.send_mail_nodemailer(email,"trip_summary",{});
    }
    global.io.in("trip_"+ trip_detail.id).emit('trip_detail', { trip_detail });
    return res.apiResponse(true, "Status Updated Successfully",{ trip_detail });
  }
};

exports.accept_request = async (req, res, next) => {
  var requests = req.bodyParams;
  var request_detail = await RequestDetail.findOne({ trip_id: requests.trip_id, driver_id: requests.driver_id });
  var trip_detail = await Trip.findOne({_id:requests.trip_id});
  if(trip_detail.trip_status=="processing")
  {
    await Trip.findOneAndUpdate(
      { _id: requests.trip_id },
      { $set: 
        {
        'driver_id': requests.driver_id,
        'trip_status': 'accepted',
        'is_deleted': false,
        'accepted_at':moment(),
        'duration':request_detail.duration
        }  
      },
      { new: true }
    ).exec();


    //updating trip id in driver table(user table) for send driver instance location to all using sockets
    await User.findOneAndUpdate({ _id: requests.driver_id },{ $set: {'current_trip_id': requests.trip_id}},{ new: true }).exec();
    
    var trip_populate=['user_detail','caregiver_detail','driver_detail',
    {
      path:'user_rating',
      match:{rating_type:'driver-user'}
    },
    {
      path:'driver_rating',
      match:{rating_type:'user-driver'}
    },
    {
      path:'is_user_rated',
      match:{rating_type:'driver-user'}
    },
    {
      path:'is_driver_rated',
      match:{rating_type:'user-driver'}
    }];
    var trip_detail = await Trip.findOne({ _id: requests.trip_id }).populate(trip_populate);
    commonHelper.put_logs(trip_detail.driver_id,trip_detail.invoice_id+" - Request accepted");
    commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Request accepted by "+trip_detail.driver_detail.name);
    await caregiver_push_notifications(trip_detail);
    global.io.in("user_"+ trip_detail.user_id).emit('trip_detail', { trip_detail });
    return res.apiResponse(true, "Request Accepted Successfully", { trip_detail } );
  }
  else
  {
    return res.apiResponse(false, "Request Already Accepted");
  }
};
exports.caregiver_reminder_cron = async(req,res,next)=>{
  await func_caregiver_reminder_cron().then(async(data) => {
    if(req)
    {
      return res.apiResponse(true, "Order updated Successfully",data)
    }
  });
}
async function func_caregiver_reminder_cron() {
  const today = moment().startOf('day')
  var trips = await Trip.find({trip_status:'start_trip'});
  if(trips.length)
  {
    for(var i=0; i<trips.length;i++)
    {
      var estimated_time = moment(trips[i].started_at).add(trips[i].distances.durationValue, 'seconds');  // see the cloning?
      if(moment(estimated_time).isSameOrAfter())
      {
        var a = moment();//now
        var b = moment(estimated_time);
        if(b.diff(a, 'minutes')==5)
        {
          var trip_populate=['user_detail','caregiver_detail','driver_detail',
          {
            path:'user_rating',
            match:{rating_type:'driver-user'}
          },
          {
            path:'driver_rating',
            match:{rating_type:'user-driver'}
          },
          {
            path:'is_user_rated',
            match:{rating_type:'driver-user'}
          },
          {
            path:'is_driver_rated',
            match:{rating_type:'user-driver'}
          }];
          var trip_detail = await Trip.findOne({ _id: trips[i]._id}).populate(trip_populate);
          global.io.in("user_" + trips[i].care_giver_id).emit('caregiver_reminder', {trip_detail});
          var caregiver_detail = await User.findOne({'_id':trips[i].care_giver_id});
          if (caregiver_detail.device_id && caregiver_detail.device_id.length) {
            for (let i = 0; i < caregiver_detail.device_id.length; ++i) {
              Firebase.singleNotification(
                caregiver_detail.device_id[i],
                "Under Care ["+user_detail.name+"]",
                trip_detail.invoice_id+" - Almost near you, we will reach you in 5 minutes"
              );
            }
          }
        }
      }
    }
  }
  return trips;
}
exports.cancel_request = async (req, res, next) => {
  var requests = req.bodyParams;
  if(requests.type=="user")
  {
    await Trip.findOneAndUpdate({ "_id": requests.trip_id }, { "$set": { 'cancelled_at':moment(),'trip_status': 'cancelled' } }, { new: true },async(err,doc,trip_detail)=>{
      await caregiver_push_notifications(trip_detail);
    }).exec();
    await RequestDetail.deleteMany({'trip_id':requests.trip_id},function(){});
  }
  else
  {
    var request_detail = await RequestDetail.findOne({ trip_id: requests.trip_id, driver_id: requests.driver_id });
    if(request_detail)
    {
      request_detail.remove();
    }
  }
  return res.apiResponse(true, "Request Cancelled");
};
async function check_rating_for_complete_trip(trip_id) {
  var trip_detail = await Trip.findOne({ _id: trip_id}).populate(['is_user_rated','is_driver_rated']);
  if(trip_detail)
  {
    if(trip_detail.is_user_rated && trip_detail.is_driver_rated)
    {
      await Trip.findOneAndUpdate({ _id: trip_id },
        { $set: 
          {
            trip_status:'completed'
          }
        },
        { new: true }
      ).exec();
    }
    else
    {
      await Trip.findOneAndUpdate({ _id: trip_id },
        { $set: 
          {
            trip_status:'rating'
          }
        },
        { new: true }
      ).exec();
    }
  }
}
exports.rate_user = async(req, res) => {
  var requests = req.bodyParams
  var trip_details = await Trip.findOne({ '_id': requests.trip_id });
  if(trip_details)
  {
    var new_rating = new Rating({
      user_id: trip_details.user_id,
      trip_id: requests.trip_id,
      driver_id: trip_details.driver_id,
      rating: requests.rating,
      message: requests.message,
      rating_type:'driver-user'
    })
    new_rating.save(async(err, result) => {
        var five_star_rating = await Rating.find({ 'user_id': trip_details.user_id,'rating_type':'driver-user', 'rating': 5 });
        var four_star_rating = await Rating.find({ 'user_id': trip_details.user_id,'rating_type':'driver-user', 'rating': 4 });
        var three_star_rating = await Rating.find({ 'user_id': trip_details.user_id,'rating_type':'driver-user', 'rating': 3 });
        var two_star_rating = await Rating.find({ 'user_id': trip_details.user_id,'rating_type':'driver-user', 'rating': 2 });
        var one_star_rating = await Rating.find({ 'user_id': trip_details.user_id,'rating_type':'driver-user', 'rating': 1 });
        five_star_rating = five_star_rating.length;
        four_star_rating = four_star_rating.length;
        three_star_rating = three_star_rating.length;
        two_star_rating = two_star_rating.length;
        one_star_rating = one_star_rating.length;
        var total_rating = (5 * five_star_rating + 4 * four_star_rating + 3 * three_star_rating + 2 * two_star_rating + 1 * one_star_rating) / (five_star_rating + four_star_rating + three_star_rating + two_star_rating + one_star_rating)
        total_rating = parseFloat(total_rating).toFixed(1).toString()
        await check_rating_for_complete_trip(requests.trip_id);
        await User.findOneAndUpdate({ "_id": trip_details.user_id }, { "$set": { 'user_rating': total_rating } }, { new: true }).exec();
        return res.apiResponse(true, "Review Updated Successfully")
    })
  }
  else
  {
    return res.apiResponse(false, "Invalid Trip")
  }
}

exports.rate_driver = async(req, res) => {
  var requests = req.bodyParams
  var trip_details = await Trip.findOne({ '_id': requests.trip_id });
  if(trip_details)
  {
    var new_rating = new Rating({
      user_id: trip_details.user_id,
      trip_id: requests.trip_id,
      driver_id: trip_details.driver_id,
      rating: requests.rating,
      message: requests.message,
      rating_type:'user-driver'
    })
    new_rating.save(async(err, result) => {
        var five_star_rating = await Rating.find({ 'driver_id': trip_details.driver_id,'rating_type':'user-driver', 'rating': 5 });
        var four_star_rating = await Rating.find({ 'driver_id': trip_details.driver_id,'rating_type':'user-driver', 'rating': 4 });
        var three_star_rating = await Rating.find({ 'driver_id': trip_details.driver_id,'rating_type':'user-driver', 'rating': 3 });
        var two_star_rating = await Rating.find({ 'driver_id': trip_details.driver_id,'rating_type':'user-driver', 'rating': 2 });
        var one_star_rating = await Rating.find({ 'driver_id': trip_details.driver_id,'rating_type':'user-driver', 'rating': 1 });
        five_star_rating = five_star_rating.length;
        four_star_rating = four_star_rating.length;
        three_star_rating = three_star_rating.length;
        two_star_rating = two_star_rating.length;
        one_star_rating = one_star_rating.length;
        var total_rating = (5 * five_star_rating + 4 * four_star_rating + 3 * three_star_rating + 2 * two_star_rating + 1 * one_star_rating) / (five_star_rating + four_star_rating + three_star_rating + two_star_rating + one_star_rating)
        total_rating = parseFloat(total_rating).toFixed(1).toString()
        await check_rating_for_complete_trip(requests.trip_id);
        await User.findOneAndUpdate({ "_id": trip_details.driver_id }, { "$set": { 'user_rating': total_rating } }, { new: true }).exec();
        return res.apiResponse(true, "Review Updated Successfully")
    })
  }
  else
  {
    return res.apiResponse(false, "Invalid Trip")
  }
}
exports.request_order = async(req, res, next) => 
{
  var requests = req.bodyParams;
  if(!requests.care_giver_id)
  {
    delete requests.care_giver_id;
  }
  var category_detail = await Category.findOne({ '_id': requests.category_id });
  category_detail = JSON.parse(JSON.stringify(category_detail));
  var price_detail = {}
  if(typeof requests.distances.selected_origin==="undefined")
  {
    requests.distances = JSON.parse(requests.distances);
  }
  price_detail.total = parseFloat(category_detail.price * (requests.distances.distanceValue/1000)).toFixed(2);
  price_detail.commission = parseFloat(category_detail.commission * parseFloat(price_detail.total)/100).toFixed(2);
  price_detail.driver_payout = price_detail.total - price_detail.commission;
  

  var trip_detail = {
    user_id: requests.user_id,
    care_giver_id: requests.care_giver_id,
    service_type: requests.service_type,
    category_detail: category_detail,
    distances: requests.distances,
    payment_mode: requests.payment_mode,
    price_detail:price_detail,
    is_care_giver:(requests.service_type=='Independent Trip')?false:true
  };
  
  var newTrip = new Trip(trip_detail);
  var trip_detail = await newTrip.save();


  function_request_order(requests,trip_detail).then(async(trip_detail) => {
    if(trip_detail=="no_drivers")
    {
        return res.apiResponse(false, "No Drivers found near you")
    }
    else if(trip_detail=="already_process")
    {
        return res.apiResponse(false, "Trip already processing")
    }
    else
    {
      await caregiver_push_notifications(trip_detail);
      return res.apiResponse(true, "Trip request processing", { trip_detail } )
    }
  });
}

async function function_request_order(requests,trip_detail) {
  var trip_details = await Trip.findOne({ 'user_id': requests.user_id, 'trip_status': "pending" });
  var orgin = requests.distances.selected_origin.split(',')  
  var match = {
        role: 2,
        status: 'active'    
      }
    match['trip_status'] = 'online';
    match['is_deleted'] = false;
    match['category_id'] = requests.category_id;
    match['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: [orgin[1],orgin[0]]
            }
        }
    }
    // match['email']={$in:["hey@gmail.com"]};
    var get_drivers = await User.find(match);
    console.log("nearest drivers",get_drivers.length)
    if (get_drivers.length) {
      var trip_request_old = await RequestDetail.find({ 'trip_id': trip_details._id });
      if (!trip_request_old.length) 
      {
        await Trip.findOneAndUpdate({ "_id": trip_detail._id }, { "$set": { trip_status: 'processing'}}).exec();
        trip_detail.trip_status = "processing";

        for (let i = 0; i < get_drivers.length; ++i) {
          var already_requested_driver = await RequestDetail.find({ 'driver_id': get_drivers[i]._id });
          var distance = geolib.getDistance({ latitude: get_drivers[i].location.coordinates[0], longitude: get_drivers[i].location.coordinates[1] }, { latitude: orgin[0], longitude: orgin[1] })
            var km = "1";
            if (distance >= 1000) {
                km = parseFloat(parseFloat(distance) / 1000).toFixed(2);
            }
            var duration = Number(Math.round(parseInt(km)/50 * 60)).toString()+" mins";
            if (already_requested_driver.length) {
              var new_request_data = {
                user_id: requests.user_id,
                care_giver_id: requests.care_giver_id,
                trip_id: trip_detail._id,
                driver_id: get_drivers[i]._id,
                request_status: 'Pending',
                sort: i,
                duration:duration,
                is_deleted:false
              }
            } 
            else {
              var new_request_data = {
                user_id: requests.user_id,
                care_giver_id: requests.care_giver_id,
                trip_id: trip_detail._id,
                driver_id: get_drivers[i]._id,
                request_status: 'Requesting',
                sort: i,
                duration:duration,
                is_deleted:false
              }
            }
            var new_request = new RequestDetail(new_request_data);
            await new_request.save();
        }
        commonHelper.put_logs(trip_detail.user_id,trip_detail.invoice_id+" - Requesting Drivers");
        Agenda.now('requestProcess', { trip_detail }) // requests
        return trip_detail;
      } 
      else
      {
        return "already_process";
      }
    } 
    else {
      var new_result = {}
      new_result.message = "not_available"
      global.io.in("user_" + trip_detail.user_id).emit('not_accept', {});
      return "no_drivers";
    }
}
exports.create_stripe_token = async(req, res, next) => 
{
  // var requests = req.bodyParams;
  // var charge = stripe.sources.create({  // stripe payment start
  //   type: 'ach_credit_transfer',
  //   currency: 'usd',
  //   owner: {
  //     email: 'jenny.rosen@example.com'
  //   }
  // }, async (err, charge) => {
  //   if (err) {
  //     return res.apiResponse(false, "Failed", {err})
  //   }
  //   else {
  //     return res.apiResponse(true, "Charged", {charge})
  //   }
  // })
  commonHelper.send_mail_nodemailer("ak@waioz.com","booking_confirmation",{});
  return res.apiResponse(true, "Charged")
}
async function get_stripe_customer_id(user_detail) {
  if(user_detail.stripe_customer)
  {
    return user_detail.stripe_customer;
  }
  else
  {
    var customer = await stripe.customers.create({  // stripe payment start
      name:  user_detail.name,
      email:  user_detail.email,
      phone:  user_detail.phone,
      description:  "Transport Care Customer "+user_detail.email
    })
    if(!customer.id)
    {
      return false;
    }
    else{
      await User.findOneAndUpdate({ _id: user_detail.id},
        { $set: 
          {
          'stripe_customer': customer.id
          }  
        },
        { new: true }
      ).exec();
      return customer.id;
    }
  }
}
async function get_stripe_account_id(user_detail) {
  if(user_detail.stripe_account)
  {
    return user_detail.stripe_account;
  }
  else
  {
    var account = await stripe.accounts.create({  // stripe payment start
      type: 'custom',
      email: user_detail.email,
      country: 'US',
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
      }
    })
    if(!account.id)
    {
      return false;
    }
    else{
      await User.findOneAndUpdate({ _id: user_detail.id},
        { $set: 
          {
          'stripe_account': account.id
          }  
        },
        { new: true }
      ).exec();
      return account.id;
    }
  }
}
exports.add_stripe_card = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var user_detail = await User.findOne({ "_id": requests.user_id });
  await get_stripe_customer_id(user_detail).then(async(customer_id) => {
    if(customer_id)
    {
      var card_details = await stripe.customers.createSource(customer_id,{
        source: requests.token
      }, async (err, card_details) => {
        if (err) {
          return res.apiResponse(false, "Failed", {err})
        }
        else {
          var card_data = {}
          card_data.card_id = card_details.id;
          card_data.card_details = card_details;
          card_data.user_id = requests.user_id;
          let stripe_card = new StripeCards(card_data);
          await stripe_card.save();
          return res.apiResponse(true, "Card added succesfully",{stripe_card})
        }
      })
    }
    else
    {
      return res.apiResponse(false, "Error on creating stripe customer")
    }
  })
}

exports.driver_payout = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var user_detail = await User.findOne({ "_id": requests.user_id });
  if(parseFloat(user_detail.wallet_amount) >= parseFloat(requests.amount))
  {
    if(user_detail.stripe_account)
    {
      await stripe.transfers.create({
        amount: parseFloat(requests.amount)*100,
        currency: 'sgd',
        description:"",
        destination: user_detail.stripe_account,
        transfer_group: 'ORDER_95',
      }, async (err, transfer_details) => {
        if (err) {
          return res.apiResponse(false, "Failed", {err})
        }
        else {
          var transaction_data = {}
          transaction_data.amount = requests.amount;
          transaction_data.orginal_amount = requests.amount;
          transaction_data.user_id = requests.user_id;
          transaction_data.type = 'driver_payout';
          transaction_data.transaction_id = transfer_details.id;
          transaction_data.payment_type = "stripe";
          transaction_data.status = 'completed';
          let transactions = new TransactionModel(transaction_data);
          await transactions.save();

          user_detail.wallet_amount = Number(parseFloat(user_detail.wallet_amount) - parseFloat(requests.amount)).toFixed(2);
          user_detail.wallet_amount = Number(parseFloat(user_detail.received_wallet) + parseFloat(requests.amount)).toFixed(2);
          await user_detail.save();
        }
      })
    }
    else
    {
      return res.apiResponse(false, "Need to create stripe account")
    }    
  }
  else
  {
    return res.apiResponse(false, "Try to get more amount")
  }
}
exports.add_stripe_external_card = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var user_detail = await User.findOne({ "_id": requests.user_id });
  await get_stripe_account_id(user_detail).then(async(account_id) => {
    if(account_id)
    {
      var card_details = await stripe.accounts.createExternalAccount(account_id,{
        external_account: requests.token
      }, async (err, card_details) => {
        if (err) {
          return res.apiResponse(false, "Failed", {err})
        }
        else {
          var card_data = {}
          card_data.card_id = card_details.id;
          card_data.card_details = card_details;
          card_data.user_id = requests.user_id;
          card_data.card_type = "external";
          let stripe_card = new StripeCards(card_data);
          await stripe_card.save();
          return res.apiResponse(true, "Card added succesfully",{stripe_card})
        }
      })
    }
    else
    {
      return res.apiResponse(false, "Error on creating stripe customer")
    }
  })
}
exports.delete_stripe_card = async(req, res, next) => 
{
  var requests = req.bodyParams;
  await StripeCards.findById(requests.card_id, async (err, card) => {
    if (card) {
      await card.remove();
      return res.apiResponse(true, "Card deleted successfully")
    }
    else
    {
      return res.apiResponse(false, "Invalid Card Id")
    }
  });
}
exports.get_stripe_cards = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var match={}
  match.user_id=requests.user_id;
  var stripe_cards = await StripeCards.find(match).sort({createdAt:-1});
  return res.apiResponse(true, "Success", {stripe_cards})
}
async function add_stripe_card_while_payment(requests,user_detail,trip_details) {
  if(trip_details.payment_mode=="wallet" || trip_details.payment_mode=="coh")
  {
    return {status:true,token:trip_details.payment_mode, type:"saved_card"}
  }
  else if(requests.card_type=="existing")
  {
    return {status:true,token:requests.token, type:"saved_card"}
  }
  else if(requests.save_card && requests.card_type=="new")
  {
    var customer_id = await get_stripe_customer_id(user_detail);
    if(customer_id)
    {
      var card_details = await stripe.customers.createSource(customer_id,{
        source: requests.token
      })
      if (!card_details.id) {
        return {status:false,token:requests.token, type:"Error on saving stripe card"}
      }
      else {
        var card_data = {}
        card_data.card_id = card_details.id;
        card_data.card_details = card_details;
        card_data.user_id = requests.user_id;
        let stripe_card_data = new StripeCards(card_data);
        await stripe_card_data.save();
        return {status:true,token:card_details.id, type:"saved_card"}
      }
    }
    else
    {
      return {status:false,token:requests.token, type:"Error on creating stripe customer"}
    }
  }
  else
  {
    return {status:true,token:requests.token, type:"token"}
  }
}
async function caregiver_push_notifications(trip_details) {
  if(trip_details && trip_details.service_type!="Independent Trip")
  {
    var caregiver_detail = await User.findOne({'_id':trip_details.care_giver_id});
    var user_detail = await User.findOne({'_id':trip_details.user_id});
    var driver_detail = await User.findOne({'_id':trip_details.driver_id});
    if(user_detail && (user_detail.role==1 || user_detail.role=="1") && trip_details.care_giver_id)
    {
      var message=""
      // processing, accepted ,arrived, start_trip, end_trip, payment, rating, completed, cancelled
      switch (trip_details.trip_status) {
        case "processing":
          message=trip_details.invoice_id+" - "+"Trying to reach your place, Requesting drivers now"
          break;
        case "accepted":
          message=trip_details.invoice_id+" - "+driver_detail.name+" accepted request";
          commonHelper.put_logs(trip_details.care_giver_id,trip_details.invoice_id+" - Request accepted by "+trip_details.driver_detail.name);
          break;
        case "arrived":
          message=trip_details.invoice_id+" - "+driver_detail.name+" reached undercare's location and ready to pickup";
          break;
        case "start_trip":
          message=trip_details.invoice_id+" - "+" Trip Started, will be reach in "+trip_details.duration;
        break;
        case "end_trip":
          message=trip_details.invoice_id+" - "+" Reached your location";
        break;
        case "cancelled":
          message=trip_details.invoice_id+" - "+" Cancelled the appointment";
        break;
        default:
          break;
      }
      commonHelper.put_logs(trip_details.care_giver_id,message);
      if (caregiver_detail.device_id && caregiver_detail.device_id.length) {
        for (let i = 0; i < caregiver_detail.device_id.length; ++i) {
          Firebase.singleNotification(
            caregiver_detail.device_id[i],
            "Under Care ["+user_detail.name+"]",
            message
          );
        }
      }
    }
  }
  
}
async function make_payment(payment_data,trip_details,user_detail) {
  var payment_mode = trip_details.payment_mode;
  if(payment_mode=="card")
  {
    var charge = await stripe.charges.create(payment_data);
    if (charge.id) {
      return {status:true,message:charge.id,payment_type:"payment_gateway"}
    }
    else {
      return {status:false,message:"Payment Failed"}
    }
  }
  else if(payment_mode=="wallet")
  {
    if(parseFloat(payment_data.amount/100)<=parseFloat(user_detail.wallet_amount))
    {
      var updated_wallet_amount = (parseFloat(user_detail.wallet_amount)- parseFloat(payment_data.amount/100)).toFixed(2)
      await User.findOneAndUpdate(
        { _id: user_detail.id },
        { $set: {wallet_amount: updated_wallet_amount} },
      ).exec();
      return {status:true,message:"",payment_type:"wallet_payment"}
    }
    else
    {
      return {status:false,message:"Insufficient balance in your wallet",payment_type:"wallet_payment"}
    }
  }
  else
  {
    return {status:true,message:"",payment_type:"cash"}
  }
}
exports.trip_payment = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var trip_details = await Trip.findOne({_id:requests.trip_id});
  if(trip_details)
  {
    var user_detail = await User.findOne({ "_id": requests.user_id });
    var driver_detail = await User.findOne({ "_id": trip_details.driver_id });
    add_stripe_card_while_payment(requests,user_detail,trip_details).then(async(results) => {
      if(results.status)
      {
        var payment_amount = Math.round(parseFloat(trip_details.price_detail.total));
        var payment_data={
          amount:  payment_amount*100,
          currency: 'sgd',
          source: results.token,
          receipt_email:user_detail.email
        }
        if(user_detail.stripe_customer)
        {
          payment_data.customer = user_detail.stripe_customer
        }
        make_payment(payment_data,trip_details,user_detail).then(async(payment_results) => {
          if(payment_results.status)
          {
            var transaction_data = {}
            transaction_data.amount = trip_details.price_detail.total;
            transaction_data.orginal_amount = trip_details.price_detail.total;
            transaction_data.user_id = requests.user_id;
            transaction_data.type = 'order_payment';
            transaction_data.transaction_id = payment_results.message;
            transaction_data.payment_type = payment_results.payment_type;
            transaction_data.status = 'completed';
            let transactions = new TransactionModel(transaction_data);
            await transactions.save();
            initiate_driver_payout(driver_detail,trip_details)
            await Trip.findOneAndUpdate({ _id: requests.trip_id },{ $set: {'paid_at':moment(),'payment_status':'Paid','trip_status': 'rating'}},{ new: true },async(err,trip_detail)=>{
              var trip_populate=['user_detail','caregiver_detail','driver_detail',
              {
                path:'user_rating',
                match:{rating_type:'driver-user'}
              },
              {
                path:'driver_rating',
                match:{rating_type:'user-driver'}
              },
              {
                path:'is_user_rated',
                match:{rating_type:'driver-user'}
              },
              {
                path:'is_driver_rated',
                match:{rating_type:'user-driver'}
              }];
              var trip_detail = await Trip.findOne({ _id: requests.trip_id}).populate(trip_populate);
              global.io.in("trip_"+ trip_detail.id).emit('trip_detail', { trip_detail });
            }).exec();
            return res.apiResponse(true, "Payment Success")
          }
          else
          {
            return res.apiResponse(false, payment_results.message)
          }
        })
      }
      else
      {
        return res.apiResponse(false, results.type)
      }
    })
  }
  else
  {
    return res.apiResponse(false, "Invalid Trip Id")
  }
}
exports.add_wallet = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var charge = await stripe.charges.create({  // stripe payment start
    amount:  Math.round(parseInt(requests.total_amount)*100),
    currency: 'sgd',
    source: requests.token
  }, async (err, charge) => {
    if (err) {
      return res.apiResponse(false, "Failed", {err})
    }
    else {
      var user_detail = await User.findOne({ "_id": requests.user_id });
      let current_user_wallet = 0
      if(user_detail.wallet_amount && user_detail.wallet_amount !== 'NaN'){
          current_user_wallet = user_detail.wallet_amount 
      }
      user_detail.wallet_amount = Number(parseFloat(current_user_wallet) + parseFloat(requests.total_amount)).toFixed(2);
      await user_detail.save();
      var transaction_data = {}
      transaction_data.amount = charge.amount;
      transaction_data.orginal_amount = requests.total_amount;
      transaction_data.user_id = requests.user_id;
      transaction_data.type = 'wallet';
      transaction_data.transaction_id = charge.id;
      transaction_data.payment_type = 'payment gateway';
      transaction_data.status = 'completed';
      /**
       * @info send email using through nodemailer after payment *(booking confirmatin)
       */
      commonHelper.send_mail_nodemailer(user_detail.email,"booking_confirmation",{});
      let transactions = new TransactionModel(transaction_data);
      await transactions.save();
      return res.apiResponse(true, "Amount added", {user_detail})
    }
  })
}