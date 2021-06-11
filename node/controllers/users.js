var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectID;
const User = require("../models/user");
const Log = require("../models/log");
const Firebase = require("../config/firebase");
const moment = require("moment");
const _ = require("lodash");

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
    console.log("requests.user_id : ", requests.id);
    var user_detail = await User.findOne({ _id: ObjectId(requests.id) });
    return res.apiResponse(true, "Success", { user_detail });
  } else {
    return res.apiResponse(false, "Success");
  }
};

exports.delete_user = async (req, res, next) => {
  var requests = req.bodyParams;
  await User.findById(requests.id, async (err, user) => {
    if (user) {
      await user.remove();
    }
  });
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
