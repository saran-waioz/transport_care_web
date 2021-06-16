// grab the things we need
const mongoose = require('mongoose');

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

const feedbackSchema = new mongoose.Schema({
    user_id: String,
    message: String,
    is_deleted: {
        type: Boolean,
        default: false
    }    
}, schemaOptions);
module.exports = mongoose.model('feedback', feedbackSchema);

