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
    request_status: { //Requesting, Accepted, Cancelled
      type: String,
      default: "Pending"
    },
    duration:String,
    sort: Number,
    is_deleted: {
        type: Boolean,
        default: false
    }    
}, schemaOptions);



requestDetailSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Request_detail', requestDetailSchema);

