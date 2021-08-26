// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");

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
    user_id: String,
    message: String,
    info: Object,
    type: String //status ,error,warning,info

},schemaOptions);

logSchema.virtual('show_created_date').get(function () {
    var utc = moment.utc(this.createdAt);
    return moment(utc).tz(process.env.TIME_ZONE).format('YYYY-MM-DD hh:mm A')
  });

module.exports = mongoose.model('Log', logSchema);