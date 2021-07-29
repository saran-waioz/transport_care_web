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
  console.log("get",requests)
  if (
    requests.id &&
    requests.id != "" &&
    requests.id != null &&
    requests.id != "null"
  ) {
    console.log("requests.user_id : ", requests.id);
    var user_detail = await User.findOne({ _id: requests.id }).populate(['driver_status_detail']);
    return res.apiResponse(true, "Success", { user_detail });
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

exports.get_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
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
          return res.apiResponse(true, "Success", caregivers )
      });
  }
  else {
      var caregivers = await User.find(match).sort(sort);
      return res.apiResponse(true, "Success", caregivers )
  }

}

exports.add_user_caregiver = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  //if(requests.type == "add") {
    if(requests.user_id) {
      var check_user_caregiver = await UserCareGiver.find({ user_id: requests.user_id, care_giver_id: requests.care_giver_id});
      if(check_user_caregiver.length) {
        return res.apiResponse(false, "User can already have an Caregiver");
      }
      else {
        var check_user = await User.find({ _id: requests.user_id, role: 1 });
        if(check_user.length) {
          var newCareGiver = new UserCareGiver(requests);
          await newCareGiver.save();
          return res.apiResponse(true, "Record Inserted Successfully", newCareGiver._id)
        }
      }
    }
    else {
      return res.apiResponse(false, "Please Create the User");
    }
  //}
  // if(requests.type == "update") {
  //   var old_caregiver_detail = await UserCareGiver.findOne({ user_id: requests.user_id, care_giver_id: requests.care_giver_id });
  //   if(old_caregiver_detail) {
  //     await UserCareGiver.findOneAndUpdate(
  //       { user_id: requests.user_id, care_giver_id: requests.care_giver_id },
  //       { $set: requests },
  //       { new: true }
  //     ).exec();
  //     return res.apiResponse(true, "Record Updated Successfully");
  //   }
  // }
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
  console.log(requests);
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
          path: 'user_detail',
        },
        {
          path: 'caregiver_detail',
        }  
      ])
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
      var caregivers = await UserCareGiver.find(match).sort(sort);
      return res.apiResponse(true, "Success", caregivers )
  }

}

exports.add_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  
  if(requests.type == "add") {
    var check_user = await User.find({ _id: requests.driver_id, role: 2 });
    if(check_user.length) {
      var newAttender = new Attender(requests);
      await newAttender.save();
      return res.apiResponse(true, "Record Inserted Successfully", newAttender._id)
    }
  }
  if(requests.type == "update") {
    var old_attender_detail = await Attender.findOne({ _id: requests.id });
    if(old_attender_detail) {
      await Attender.findOneAndUpdate(
        { _id: requests.id },
        { $set: requests },
        { new: true }
      ).exec();
      return res.apiResponse(true, "Record Updated Successfully");
    }
  }
}

exports.delete_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  await Attender.findOne({ _id: requests.id }, async (err, driver_attender) => {
    if (driver_attender) {
      await driver_attender.remove();
    }
  });
  return res.apiResponse(true, "Record Deleted Successfully");
}

exports.get_driver_attender = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
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
      Attender.paginate(match, options, function (err, attender) {
          return res.apiResponse(true, "Success", attender )
      });
  }
  else {
      var attender = await Attender.find(match).sort(sort);
      return res.apiResponse(true, "Success", attender ) 
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
      { new: true }
    ).exec();
    return res.apiResponse(true, "Record Updated Successfully");
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
    { name: "Door to Door", image: commonHelper.getBaseurl() + "/media/assets/uploads/door_to_door_image.jpeg", is_care: true }, 
    { name: "Independent Trip", image: commonHelper.getBaseurl() + "/media/assets/uploads/independent_image.jpeg", is_care: false }, 
    { name: "Caregiver", image: commonHelper.getBaseurl() + "/media/assets/uploads/caregiver_image.jpeg", is_care: true }
  ];

  if (typeof requests.user_id != "undefined" && requests.user_id != "") {
      match['user_id'] = requests.user_id;
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
      var nearby_drivers = await User.find(matches);
  }

  var caregivers = await UserCareGiver.find(match).sort({is_default:-1}).populate([
    {
      path: 'caregiver_detail',
    }  
  ]);
  var current_trip_detail = await Trip.find({ user_id: requests.user_id, is_deleted: false });
  return res.apiResponse(true, "Success", { caregivers, service_type, current_trip_detail, nearby_drivers });

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
      trip_status: 'offline'
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
  if (typeof req.bodyParams == "undefined") {
    var requests = req;
  } 
  else {
    var requests = req.bodyParams;
  }

  var old_detail = await Trip.findOne({ _id: requests.trip_id, user_id: requests.user_id });
  if(old_detail) {
    await Trip.findOneAndUpdate({ _id: requests.trip_id },
      { $set: 
        {
        'trip_status': requests.status,
        'is_deleted': false
        }  
      },
      { new: true }
    ).exec();
      if(old_detail.driver_id && requests.status == 'start_trip') {
        await User.findOneAndUpdate({ _id: old_detail.driver_id, role: 2 },
          { $set: 
            {
            'trip_status': 'trip'
            }  
          },
          { new: true }
        ).exec();
      }
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
      var trip_detail = await Trip.findOne({ _id: requests.trip_id}).populate(['user_detail','caregiver_detail','driver_detail']);
      global.io.in("user_"+ trip_detail.user_id).emit('trip_detail', { trip_detail });
    return res.apiResponse(true, "Status Updated Successfully");
  }
};

exports.accept_request = async (req, res, next) => {
  var requests = req.bodyParams;
  var request_detail = await RequestDetail.findOne({ trip_id: requests.trip_id, driver_id: requests.driver_id });
  console.log(request_detail)
  await Trip.findOneAndUpdate(
    { _id: requests.trip_id },
    { $set: 
      {
      'driver_id': requests.driver_id,
      'trip_status': 'Accepted',
      'is_deleted': false,
      'duration':request_detail.duration
      }  
    },
    { new: true }
  ).exec();
  var trip_detail = await Trip.findOne({ _id: requests.trip_id }).populate(['user_detail','caregiver_detail','driver_detail']);
  global.io.in("user_"+ trip_detail.user_id).emit('trip_detail', { trip_detail });
  return res.apiResponse(true, "Request Accepted Successfully", { trip_detail } );
};

exports.cancel_request = async (req, res, next) => {
  if (typeof req.bodyParams == "undefined") {
    var requests = req;
  } 
  else {
    var requests = req.bodyParams;
  }

  var request_detail = await RequestDetail.findOne({ _id: requests.request_id, driver_id: requests.driver_id });
  if(request_detail) {
    await RequestDetail.findOneAndDelete({ _id: request_detail._id}).exec();
    return res.apiResponse(true, "Request Cancelled");
  }
};

exports.rate_delivery = async(req, res) => {
  var requests = req.bodyParams
  var new_rating = new Rating({
    user_id: requests.user_id,
    trip_id: requests.trip_id,
    driver_id: requests.driver_id,
    rating: requests.rating,
    message: requests.message
  })
  new_rating.save(async(err, result) => {
      var five_star_rating = await Rating.find({ 'driver_id': requests.driver_id, 'rating': 5 });
      var four_star_rating = await Rating.find({ 'driver_id': requests.driver_id, 'rating': 4 });
      var three_star_rating = await Rating.find({ 'driver_id': requests.driver_id, 'rating': 3 });
      var two_star_rating = await Rating.find({ 'driver_id': requests.driver_id, 'rating': 2 });
      var one_star_rating = await Rating.find({ 'driver_id': requests.driver_id, 'rating': 1 });
      five_star_rating = five_star_rating.length;
      four_star_rating = four_star_rating.length;
      three_star_rating = three_star_rating.length;
      two_star_rating = two_star_rating.length;
      one_star_rating = one_star_rating.length;
      var total_rating = (5 * five_star_rating + 4 * four_star_rating + 3 * three_star_rating + 2 * two_star_rating + 1 * one_star_rating) / (five_star_rating + four_star_rating + three_star_rating + two_star_rating + one_star_rating)
      total_rating = parseFloat(total_rating).toFixed(1).toString()
      await User.findOneAndUpdate({ "_id": requests.driver_id }, { "$set": { 'user_rating': total_rating } }, { new: true }).exec();
      return res.apiResponse(true, "Review Updated Successfully")
  })
};

exports.request_order = async(req, res, next) => 
{
  var requests = req.bodyParams;
  var category_detail = await Category.findOne({ '_id': requests.category_id });
  var price_detail = {}
  price_detail.total = parseFloat(category_detail.price * (requests.distances.distanceValue/1000)).toFixed(2);
  var trip_detail = {
    user_id: requests.user_id,
    care_giver_id: requests.care_giver_id,
    service_type: requests.service_type,
    category_detail: category_detail,
    distances: requests.distances,
    price_detail:price_detail
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
      trip_detail = _.map('_id',trip_detail);
      return res.apiResponse(true, "Trip request processing", {trip_detail} )
    }
  });
}

async function function_request_order(requests,trip_detail) {
  var trip_details = await Trip.findOne({ 'user_id': requests.user_id, 'trip_status': "Pending" });
  var orgin = requests.distances.selected_origin.split(',')  
  var match = {
        role: 2,
        status: 'active'    
      }
    // match['trip_status'] = 'online';
    match['location'] = { 
        $nearSphere: {
            $maxDistance: 20 * 1000,
            $geometry: {
                type: "Point",
                coordinates: orgin
            }
        }
    }
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
          var distance = geolib.getDistance({ latitude: get_drivers[i].location.coordinates[1], longitude: get_drivers[i].location.coordinates[0] }, { latitude: orgin[0], longitude: orgin[1] })
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
                duration:duration
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
                duration:duration
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