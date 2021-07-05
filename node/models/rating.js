// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
var mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);

//create schemaOptions
var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    },
    timestamps:true
  };


/**
 * Rating schema
 */
const RatingSchema = new  mongoose.Schema({
    user_id: String,
    trip_id: String,
    driver_id: String,
    message: String,
    rating: Number
}, schemaOptions);
// on every save, add the date
RatingSchema.virtual('show_created').get(function () {
  var utc = moment.utc(this.createdAt);
  if(moment(utc).tz(process.env.TIME_ZONE).format('YYYY-MM-DD')==moment().tz(process.env.TIME_ZONE).format('YYYY-MM-DD'))
  {
    return moment(utc).tz(process.env.TIME_ZONE).format('hh:mm A')
  }
  else
  {
    return moment(utc).tz(process.env.TIME_ZONE).format('YYYY-MM-DD hh:mm A')
  }
});
RatingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Rating',RatingSchema);