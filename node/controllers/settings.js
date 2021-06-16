const SettingsModel = require('../models/setting');
const _ = require('lodash');


exports.get_settings = async(req, res, next) => {
    var requests = req.bodyParams
    SettingsModel.find({},function (err, settings) {
        return res.apiResponse(true, "Success",{settings})
    });
}
exports.update_settings = (req, res, next) => {
    var requests = req.bodyParams
    _.map(requests,(value,key)=>{
        SettingsModel.findOne({ "code": key },async(err, settings)=>{
            if(!settings)
            {
                let new_settings = new SettingsModel();
                new_settings.code = key;
                new_settings.value = value;
                new_settings.save();
            }
            else
            {
                await SettingsModel.findOneAndUpdate({ "code": key }, { "$set": {value:value}});
            }
        })
    })
    return res.apiResponse(true, "Updated Successfully")
}