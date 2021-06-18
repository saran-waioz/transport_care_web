const mongoose=require("mongoose")
const commonHelper=require('../helpers/commonhelpers')
var mongoosePaginate=require("mongoose-paginate-v2")

mongoose.set('useFindAndModify', false);

var schemaOptions={
    toObject:{
        virtuals:true
    },
    toJSON:{
        virtuals:true
    },
    timestamp:true

}
const categorySchema=new mongoose.Schema({
    name:String,
    parent_id:String,
    category_path:{
        type:Array,
        default:[]
    },
    status:String, //true-active,false-Inactive
    image:String,
    image_type:{
        type:String,
        default:'normal'
    },
    price:Number,
    commission:Number,
    checked:{
        type:Boolean,
        default:false
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
},schemaOptions)

categorySchema.virtual('original_image').get(function(){
    if (this.image) {
        return commonHelper.getBaseurl() + "/media/assets/uploads/" + this.image;
    }
    else {
        return commonHelper.getBaseurl() + "/media/assets/uploads/default_image.jpg";
    }
})
categorySchema.plugin(mongoosePaginate);
module.exports=mongoose.model("Category",categorySchema)