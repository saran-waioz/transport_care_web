// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
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
    timestamps:true
  };


/**
 * Transaction schema
 */
const transactionSchema = new  mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order_id:String,
    type:String,//wallet,driver_payout, order_payment, order_refund
    payment_type: String,//wallet_payment, payment_gateway, cash etc..,
    amount:String,
    purpose:String,
    transaction_id:{
        type: String,
        default: 0
      },
    orginal_amount:{
        type: String,
        default: 0
      },
    checkout_id:String,
    status:String
}, schemaOptions);
// on every save, add the date
transactionSchema.pre('save', function(next) {
  // get the current date
  var currentDate = moment();
  if (!this.created_at)
  {
    this.created_at = currentDate;
  }
  next();
});
transactionSchema.virtual('show_created').get(function () {
  var utc = moment.utc(this.createdAt);
  if(moment(utc).tz(process.env.TIME_ZONE).format('YYYY-MM-DD')==moment().tz(process.env.TIME_ZONE).format('YYYY-MM-DD'))
  {
    return moment(utc).tz(process.env.TIME_ZONE).format('hh:mm A')
  }
  else
  {
    return moment(utc).tz(process.env.TIME_ZONE).format('YYYY-MM-DD hh:mm A')
  }
});
transactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Transactions',transactionSchema);