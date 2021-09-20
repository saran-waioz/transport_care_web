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
    payment_mode: {
      type: String,
      default: "coh"  //coh,wallet,card//coh-cash on hand
    },
    admin_commission: Number,
    driver_earnings: Number,
    payment_status: {
      type: String,
      default: "Not Paid"  //Not Paid, Paid
    },
    booking_type: {
      type: String,
      default: "now"  //now, schdeule
    },              
    trip_status: {      
      type: String,
      default: "pending"  //processing, accepted ,arrived, start_trip, end_trip, payment, rating, completed, cancelled
    },
    accepted_at:Date,
    arrived_at:Date,
    started_at:Date,
    ended_at:Date,
    paid_at:Date,
    refunded_at:Date,
    completed_at:Date,
    cancelled_by:String,
    cancelled_at:Date,
    distances: Object,
    is_care_giver: {
      type:Boolean,
      default:false
    },
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
  justOne: true
});
TripDetailSchema.virtual('caregiver_detail', {
  ref: 'User',
  localField: 'care_giver_id',
  foreignField: '_id',
  justOne: true
});
TripDetailSchema.virtual('driver_detail', {
  ref: 'User',
  localField: 'driver_id',
  foreignField: '_id',
  justOne: true
});
TripDetailSchema.virtual('user_rating', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'trip_id',
  justOne: true
});
TripDetailSchema.virtual('driver_rating', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'trip_id',
  justOne: true
});
TripDetailSchema.virtual('is_user_rated', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'trip_id',
  count: true
});
TripDetailSchema.virtual('is_driver_rated', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'trip_id',
  count: true
});
TripDetailSchema.virtual('show_created_at').get(function () {
  var utc = moment.utc(this.createdAt);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('show_arrived_at').get(function () {
  var utc = moment.utc(this.arrived_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('pickup_time').get(function () {
  var utc = moment.utc(this.arrived_at);
  return moment(utc).utcOffset(env.utcOffset).format('hh:mm A')
});
TripDetailSchema.virtual('show_started_at').get(function () {
  var utc = moment.utc(this.started_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('show_ended_at').get(function () {
  var utc = moment.utc(this.ended_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('show_cancelled_at').get(function () {
  var utc = moment.utc(this.cancelled_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('show_completed_at').get(function () {
  var utc = moment.utc(this.completed_at);
  return moment(utc).utcOffset(env.utcOffset).format('YYYY-MM-DD hh:mm A')
});
TripDetailSchema.virtual('formatted_created_at').get(function () {
  var utc = moment.utc(this.createdAt);
  return moment(utc).utcOffset(env.utcOffset).format('dddd')+", "+moment(utc).utcOffset(env.utcOffset).format('LL');
});
TripDetailSchema.plugin(AutoIncrement, {inc_field: 'invoice_id',start_seq:1000});
TripDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Trip_details', TripDetailSchema);