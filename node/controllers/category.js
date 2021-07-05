const Category = require("../models/category");
const commonHelper = require("../helpers/commonhelpers");
const _ = require("lodash");
const { Validator } = require("node-input-validator");
const util = require("util");
const moment = require("moment");


exports.update_category = async (req, res, next) => {
  var requests = req.body;
  console.log("requests", req.body);
  requests = await commonHelper.trimObjc(requests);
  const v = new Validator(requests, {
    name: "required|maxLength:36",
  });

  const matched = await v.check();

  if (!matched) {
    return res.apiResponse(false, "Invalid data", v.errors);
  }
  if (requests.type == "edit") {
    await Category.findOneAndUpdate(
      { _id: requests.id },
      { $set: requests }
    ).exec();
    await upload_category(req, requests.id);
    return res.apiResponse(true, "Successfully category updated");
  } else {
    var category = new Category(requests);
    category = await category.save();
    console.log("category", category);
    await upload_category(req, category.id);
    return res.apiResponse(true, "Successfully category added");
  }
};
upload_category = async (req, id) => {
  var requests = req.bodyParams;
  console.log(req.files);
  if (req.files) {
    const media = req.files.file;
    const fileMove = util.promisify(media.mv);
    const path = "media/assets/uploads/";
    const ext = media.name.split(".").pop();
    commonHelper.prepareUploadFolder(path);
    const iconName =
      "category" + id + moment().unix() + "." + ext;
    try {
      await fileMove(path + iconName);
      var update_data = {};
      update_data["image"] = iconName;
      await Category.findOneAndUpdate(
        { _id: id },
        { $set: update_data } 
      ).exec();
    } catch (e) {
      console.log(e);
    }
  }
};
exports.get_category = async (req, res, next) => {
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
    is_deleted: false,
  };
  if(requests.id){
    match._id = requests.id
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
  Category.paginate(match, options, function (err, result) {
    return res.apiResponse(true, "Success", result);
  });
};

exports.delete_category = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log("delete_user: ", requests);
  await Category.findOneAndUpdate(
    { _id: requests.id },
    { $set: { is_deleted: true } }
  ).exec();

  return res.apiResponse(true, " Deleted Successfully");
};


exports.get_vehicle_category = async (req, res, next) => {
  var requests = req.bodyParams;
  console.log(requests);
  var page = requests.page || 1
  var per_page = requests.per_page || 10
  var pagination = requests.pagination || "false"
  const match = {
    is_deleted: false
  };

  var sort = { createdAt: -1 }
  if (requests.search && requests.search != "") {
      match.name = { $regex: new RegExp("^" + requests.search, "i") }
  }
  if (requests.sort != "") {
      switch (requests.sort) {
          case 'makes_asc':
              sort = { name: 1 }
              break;
          case 'makes_desc':
              sort = { name: -1 }
              break;
          default:
          // code block
      }
  }
  const options = {
      page: page,
      limit: per_page,
      sort: sort
  };

  if (pagination == "true") {
      Category.paginate(match, options, function (err, category) {
          return res.apiResponse(true, "Success", { category })
      });
  }
  else {
      var category = await Category.find(match).sort(sort);
      return res.apiResponse(true, "Success", { category })
  }

};