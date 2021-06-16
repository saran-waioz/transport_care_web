// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
const commonHelper = require('../helpers/commonhelpers');
mongoose.set('useFindAndModify', false);
//create schemaOptions
var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };


/**
 * welcome slider schema
 */
const SettingsSchema = new  mongoose.Schema({
    code: String,
    value : String,
    created_at: Date,
    updated_at: Date
}, schemaOptions);
// on every save, add the date
SettingsSchema.pre('save', function(next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at)
  {
    this.created_at = currentDate;
  }
  next();
});
SettingsSchema.virtual('company_signature').get(function () {
  if(this.code=="COMPANY_SIGNATURE")
  {
    return commonHelper.getBaseurl()+"/uploads/signature/"+this.value;
  }
});
module.exports = mongoose.model('Settings',SettingsSchema);