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

const StripeCardSchema = new mongoose.Schema({
    user_id: String,
    card_id: String,
    card_details: Object
}, schemaOptions);
StripeCardSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('stripe_card_schema', StripeCardSchema);