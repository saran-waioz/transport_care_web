// grab the things we need
const mongoose = require('mongoose');
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
    timestamps: true
  };

const requestDetailSchema = new mongoose.Schema({
    user_id: String,
    care_giver_id: String,
    driver_id: String,
    trip_id: String,
    request_status: { //Requesting, Accepted, Cancelled, schedule_accepted
      type: String,
      default: "Pending"
    },
    booking_type: {
      type: String,
      default: "now"
    },//now, schedule
    request_type: {
      type: String,
      default: "now"
    },//now, schedule
    schedule_status: {
      type:String,
      default:"pending"
    },//pending, approved, rejected
    schedule_date_time:Date,
    duration:String,
    sort: Number,
    is_deleted: {
        type: Boolean,
        default: false
    }    
}, schemaOptions);



requestDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Request_detail', requestDetailSchema);

