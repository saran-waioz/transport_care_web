// grab the things we need
const mongoose = require('mongoose');
const moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);
const env = process.env

const AutoIncrement = require('mongoose-sequence')(mongoose);

//create schemaOptions
var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    },
    timestamps: true
  };

const TripDetailSchema = new mongoose.Schema({
    user_id: String,
    care_giver_id: String,
    driver_id: String,
    service_type: String,
    category_detail: Object,
    price_detail: Object,
    admin_commission: Number,
    driver_earnings: Number,
    payment_status: {
      type: String,
      default: "Not Paid"  //Not Paid, Paid
    },              
    trip_status: {      
      type: String,
      default: "pending"  //processing, arrived, start_trip, end_trip, completed, cancelled
    },
    distances: Object,
    duration:String,
    invoice_id:Number,
    is_deleted: {
      type: Boolean,
      default: true
    }    
}, schemaOptions);

TripDetailSchema.virtual('user_detail', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: false
});
TripDetailSchema.virtual('caregiver_detail', {
  ref: 'User',
  localField: 'care_giver_id',
  foreignField: '_id',
  justOne: false
});
TripDetailSchema.virtual('driver_detail', {
  ref: 'User',
  localField: 'driver_id',
  foreignField: '_id',
  justOne: false
});
TripDetailSchema.virtual('show_created_at').get(function () {
  var utc = moment.utc(this.reminded_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('formatted_created_at').get(function () {
  var utc = moment.utc(this.reminded_at);
  return moment(utc).utcOffset(env.utcOffset).format('dddd')+", "+moment(utc).utcOffset(env.utcOffset).format('LL');
});
TripDetailSchema.plugin(AutoIncrement, {inc_field: 'invoice_id',start_seq:1000});
TripDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Trip_details', TripDetailSchema);