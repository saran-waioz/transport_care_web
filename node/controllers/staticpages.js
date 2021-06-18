const Static = require("../models/staticpage");
const { Validator } = require("node-input-validator");
const commonHelper = require("../helpers/commonhelpers");



exports.static = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  requests.delete = 0;
  var result = await Static.find(requests);
  return res.apiResponse(true, "Success", { result });
};
exports.get_static = async (req, res, next) => {
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
    is_deleted: false,
  };
  if(requests.id){
    match._id=requests.id
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
  Static.paginate(match, options, function (err, result) {
    return res.apiResponse(true, "Success", result);
  });
};
exports.update_static = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log("requests", requests);
  // requests = await commonHelper.trimObjc(requests);
  // const v = new Validator(requests, {
  //   name: "required|maxLength:36",
  // });

  // const matched = await v.check();

  // if (!matched) {
  //   return res.apiResponse(false, "Invalid data", v.errors);
  // }
  if (requests.type == "edit") {
    await Static.findOneAndUpdate(
      { _id: requests.id },
      { $set: requests }
    ).exec();
    return res.apiResponse(true, "Successfully static updated");
  } else {
    var static = new Static(requests);
    static = await static.save();
    console.log("static=>>",static)
    return res.apiResponse(true, "Successfully static added");
  }
};
exports.delete_static = async (req, res, next) => {
  var requests = req.bodyParams;
  await Static.findOneAndUpdate(
    { _id: requests.id },
    { $set: { is_deleted: true } }
  ).exec();
  return res.apiResponse(true, "Successfully Deleted");
};
