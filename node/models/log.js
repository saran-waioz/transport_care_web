// grab the things we need
const mongoose = require('mongoose');
var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
    timestamps: true
};

const logSchema = new mongoose.Schema({
    user_id:String,
    message:String,
    info:Object,
    type:String //status ,error,warning

},schemaOptions);
module.exports = mongoose.model('Log', logSchema);