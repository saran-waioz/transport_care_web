// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
var mongoosePaginate = require('mongoose-paginate-v2');

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
 * User schema
 */
const AdminEmailTemplate = mongoose.Schema({
    slug: String,
    title: String,
    subject: String,
    created_by:{
      type:String,
      default:"user"
    },
    content: String,
    created_at: Date,
    updated_at: Date
}, schemaOptions);
// on every save, add the date
AdminEmailTemplate.pre('save', function(next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at)
  {
    this.created_at = currentDate;
  }
  next();
});

AdminEmailTemplate.plugin(mongoosePaginate);
module.exports = mongoose.model('AdminEmailTemplate',AdminEmailTemplate);