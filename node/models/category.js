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
    is_parent:{
        type:Number,
        default:0
    },
    is_last:{
        type:Boolean,
        default:false
    },
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
categorySchema.virtual('child_count', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent_id',
    justOne: false,
    count:true
  })
  categorySchema.virtual('category_with_childs', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent_id',
    justOne: false
  })
  categorySchema.virtual('childs', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent_id',
    justOne: false
  })
  categorySchema.virtual('category_path_detail', {
    ref: 'Category',
    localField: 'category_path',
    foreignField: '_id',
    justOne: false
  })
categorySchema.virtual('original_image').get(function(){
    if(this.image){
        if(this.image_type=='normal'){
            return commonHelper.getBaseurl()+"/media/assets/uploads"+this.image
        }
        else{
            return  this.image
        }
    }
    else{
        return commonHelper.getBaseurl()+"/media/assets/image/default_image.jpg"
    }
})
categorySchema.plugin(mongoosePaginate);
module.exports=mongoose.model("Category",categorySchema)