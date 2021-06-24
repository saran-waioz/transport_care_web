// grab the things we need
const mongoose = require("mongoose");
const moment = require("moment");
const commonHelper = require("../helpers/commonhelpers");
mongoose.set("useFindAndModify", false);
//create schemaOptions
var schemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const SettingsSchema = new mongoose.Schema(
  {
    site_name: { type: String, default: "transportcare" },
    site_email: { type: String, default: "admin@transportcare.com" },
    copyrights_content: { type: String, default: "Copy Right" },
    contact_number: { type: String, default: "1234567890" },
    contact_email: { type: String, default: "admin@transportcare.com" },
    created_at: Date,
    updated_at: Date,
  },
  schemaOptions
);
// on every save, add the date
SettingsSchema.pre("save", function (next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});
SettingsSchema.virtual("created_date").get(function () {
  var created_date = moment(this.created_at);
  return created_date.format("DD/MM/YYYY");
});
module.exports = mongoose.model("Settings", SettingsSchema);
