const Category = require("../models/category");
const commonHelper = require("../helpers/commonhelpers");
const _ = require("lodash");
const { Validator } = require("node-input-validator");

exports.update_category = async (req, res, next) => {
  var requests = req.bodyParams;
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
    await update_last_category(requests.id);
    return res.apiResponse(true, "Successfully category updated");
  } else {
    var category = new Category(requests);
    await category.save();
    await upload_category(req, category.id);
    await update_last_category(category.id);
    return res.apiResponse(true, "Successfully category added");
  }
};
upload_category = async (req, id) => {
  var requests = req.bodyParams
  console.log(req.files)
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
        } catch (e) {
        }
    }
};
exports.get_category = async (req, res, next) => {
  var requests = req.bodyParams;
  var match = {};
  var page = requests.page || 1;
  var per_page = requests.per_page || 10;
  var pagination = requests.pagination || "false";
  var populate = [];
  if (requests.id && requests.id != "") {
    match["_id"] = requests.id;
  } else {
    if (requests.status && requests.status != "") {
      match["status"] = requests.status;
    }
    if (requests.is_parent && requests.is_parent != "") {
      match["is_parent"] = requests.is_parent;
    }
    if (requests.is_last && requests.is_last != "") {
      match["is_last"] = true;
    }
    if (requests.populate && requests.populate != "") {
      populate = requests.populate;
    }
    if (typeof requests.search != "undefined" && requests.search != "") {
      match.name = { $regex: ".*" + requests.search + ".*", $options: "i" };
    }
  }
  const options = {
    page: page,
    limit: per_page,
    populate: populate,
  };
  if (pagination == "true") {
    Category.paginate(match, options, function (err, category) {
      return res.apiResponse(true, "Success", { category });
    });
  } else {
    var category = await Category.find(match).populate(populate);
    return res.apiResponse(true, "Success", { category });
  }
};
update_last_category = async (id = "") => {
  if (id == "") {
    var get_all = await Category.find({
      is_parent: { $exists: false },
    }).populate(["child_count"]);
  } else {
    var get_all = await Category.find({ _id: id }).populate(["child_count"]);
  }

  for (var i = 0; i < get_all.length; i++) {
    if (!get_all[i].child_count) {
      await Category.findOneAndUpdate(
        { _id: get_all[i]._id },
        { $set: { is_last: true } }
      ).exec();
    }
  }
  return true;
};

exports.update_last = async (req, res, next) => {
  await update_last_category();
};

exports.delete_category = async (req, res, next) => {
  var requests = req.bodyParams;
  await Category.findOneAndUpdate(
    { _id: requests.id },
    { $set: { is_deleted: true } },
  ).exec();
  return res.apiResponse(true, " Deleted Successfully");
};
