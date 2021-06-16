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

const attenderSchema = new mongoose.Schema({
    driver_id: String,
    name: String,
    age: String,
    gender: String,
    is_deleted: {
        type: Boolean,
        default: false
    }    
}, schemaOptions);

attenderSchema.virtual('driver_detail', {
  ref: 'User',
  localField: 'driver_id',
  foreignField: '_id',
  justOne: false
});

attenderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('attender', attenderSchema);