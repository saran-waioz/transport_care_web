const mongoose = require("mongoose");
var mongoosePaginate=require("mongoose-paginate-v2")

mongoose.set("useFindAndModify", false);
//create 
var schemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const StaticSchema = new mongoose.Schema(
  {
    page_name: { type: String },
    description: { type: String },
    title: { type: String },
    page_code: { type: String },
    is_deleted:{type:Boolean,default:false}
  },
  schemaOptions
);
StaticSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Static", StaticSchema);
