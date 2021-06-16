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

const userCareGiverSchema = new mongoose.Schema({
    user_id: String,
    care_giver_id: String,
    is_default: {
      type: Boolean,
      default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }    
}, schemaOptions);

userCareGiverSchema.virtual('user_detail', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: false
});

userCareGiverSchema.virtual('caregiver_detail', {
  ref: 'User',
  localField: 'care_giver_id',
  foreignField: '_id',
  justOne: false
});

userCareGiverSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('user_caregiver', userCareGiverSchema);

