var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectID;
const commonHelper=require('../helpers/commonhelpers')
const User = require("../models/user");
const Log = require("../models/log");
const Firebase = require("../config/firebase");
const moment = require("moment");
const _ = require("lodash");
const UserCareGiver = require("../models/user_caregiver");
const Attender = require("../models/attender");
const Feedback = require("../models/feedback");
const Trip = require("../models/trip_details");
const RequestDetail = require("../models/request_details");
const Rating = require("../models/rating");
const Category = require("../models/category");
const distance = require("google-distance");
const Agenda = require("../agenda");
const geolib = require('geolib');
const { RequestResponseStatusCode } = require("nexmo");
const stripe = require('stripe')('sk_test_51JOl26GwzlPF3YojClmory2WxpKjuUsQZMTJJtvaYbZ6oDeitr0mOsDsrokLCy2zoN2dmlTbrvDq4cwu8r4F8aZ800Xf3bpd84');


exports.get_users = async (req, res, next) => {
  var requests = req.bodyParams;
  //console.log("requests -> ", requests);
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
  console.log("match --> ", match)
  console.log("options --> ", options)
  User.paginate(match, options, function (err, result) {
    //console.log(result);
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

exports.get_user_detail = async (req, res) => {
  var requests = req.bodyParams;
  if (
    requests.id &&
    requests.id != "" &&
    requests.id != null &&
    requests.id != "null"
  ) {
    var user_detail = await User.findOne({ _id: requests.id }).populate(['driver_status_detail','category_detail']);
    var service_type = [
      { name: "Door to Door", image: commonHelper.getBaseurl() + "/media/assets/images/door_to_door_image.jpeg", is_care: true }, 
      { name: "Independent Trip", image: commonHelper.getBaseurl() + "/media/assets/images/independent_image.jpeg", is_care: false }, 
      { name: "Caregiver", image: commonHelper.getBaseurl() + "/media/assets/images/caregiver_image.jpeg", is_care: true }
    ];
    var category_list = await Category.find();
    return res.apiResponse(true, "Success", { user_detail,service_type,category_list });
  } else {
    return res.apiResponse(false, "Success");
  }
};

exports.delete_user = async (req, res, next) => {
  console.log("delete_user: ")
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
      return res.apiResponse(true, "Record Inserted Successfully", {caregiver})
    }
  }
  else {
    return res.apiResponse(false, "Please Create the User");
  }
}

exports.delete_user_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  await UserCareGiver.findOne({ user_id: requests.user_id, care_giver_id: requests.care_giver_id}, async (err, user_caregiver) => {
    if (user_caregiver) {
      await user_caregiver.remove();
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
  console.log(requests);

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
    // matches['trip_status'] = 'online';
    matches['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: origin
            }
        }
    }
    nearby_drivers = await User.find(matches);
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
    var current_trip_detail = await Trip.find({ driver_id: requests.driver_id, is_deleted: false, trip_status:{$in:['pending', 'arrived','accepted' , 'start_trip']} }).populate(trip_populate);
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
                coordinates: origin
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
    if(old_detail.driver_id && (requests.status == 'completed' || requests.status == 'cancelled')) {
      await User.findOneAndUpdate({ _id: old_detail.driver_id, role: 2 },
        { $set: 
          {
          'trip_status': 'online'
          }  
        },
        { new: true }
      ).exec();
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
    global.io.in("user_"+ trip_detail.user_id).emit('trip_detail', { trip_detail });
    return res.apiResponse(true, "Request Accepted Successfully", { trip_detail } );
  }
  else
  {
    return res.apiResponse(false, "Request Already Accepted");
  }
};

exports.cancel_request = async (req, res, next) => {
  var requests = req.bodyParams;
  if(requests.type=="user")
  {
    await Trip.findOneAndUpdate({ "_id": requests.trip_id }, { "$set": { 'cancelled_at':moment(),'trip_status': 'cancelled' } }, { new: true }).exec();
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
  var category_detail = await Category.findOne({ '_id': requests.category_id });
  category_detail = JSON.parse(JSON.stringify(category_detail));
  var price_detail = {}
  if(typeof requests.distances.selected_origin==="undefined")
  {
    requests.distances = JSON.parse(requests.distances);
  }
  price_detail.total = parseFloat(category_detail.price * (requests.distances.distanceValue/1000)).toFixed(2);
  var trip_detail = {
    user_id: requests.user_id,
    care_giver_id: requests.care_giver_id,
    service_type: requests.service_type,
    category_detail: category_detail,
    distances: requests.distances,
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
    // match['trip_status'] = 'online';
    // match['category_id'] = 'online';
    match['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: orgin
            }
        }
    }
    // match['email']={$in:["eashwar@gmail.com","hari.m@gmail.com"]};
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
  var requests = req.bodyParams;
  var charge = stripe.sources.create({  // stripe payment start
    type: 'ach_credit_transfer',
    currency: 'usd',
    owner: {
      email: 'jenny.rosen@example.com'
    }
  }, async (err, charge) => {
    if (err) {
      return res.apiResponse(false, "Failed", {err})
    }
    else {
      return res.apiResponse(true, "Charged", {charge})
    }
  })
}
exports.add_wallet = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var charge = stripe.charges.create({  // stripe payment start
    amount:  Math.round(parseInt(requests.total_amount)*100),
    currency: 'usd',
    source: requests.token
  }, async (err, charge) => {
    if (err) {
      return res.apiResponse(false, "Failed", {err})
    }
    else {
      var user_detail = await User.findOne({ "_id": requests.user_id });
      user_detail.wallet_amount = Number(parseFloat(user.wallet_amount) + parseFloat(charge.amount)).toFixed(2);
      await user_detail.save();
      var transaction_data = {}
      transaction_data.amount = charge.amount;
      transaction_data.user_id = requests.user_id;
      transaction_data.type = 'wallet';
      transaction_data.transaction_id = charge.id;
      transaction_data.payment_type = 'payment gateway';
      transaction_data.status = 'completed';
      let transactions = new TransactionModel(transaction_data);
      await transactions.save();
      return res.apiResponse(true, "Amount added", {user_detail})
    }
  })
}