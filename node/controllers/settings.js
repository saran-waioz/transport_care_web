const Settings = require("../models/setting");
const _ = require("lodash");

exports.get_settings = async (req, res, next) => {
  var requests = req.bodyParams;
  Settings.find({}, function (err, settings) {
    return res.apiResponse(true, "Success", { settings });
  });
};
exports.update_settings = async (req, res, next) => {
  var requests = req.bodyParams;

  var result = await Settings.find({});
  //console.log(result);
  if (result.length == 0) {
      const add_site_data = new Settings(requests);
      const save = await add_site_data.save();
      return res.apiResponse(true, "Added Successfully");
    } else {
      var result = await Settings.findOneAndUpdate({ _id: result[0].id }, { $set: requests } );
        return res.apiResponse(true, "Updated Successfully",{result});
      
}
}
