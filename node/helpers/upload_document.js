const path=require("path");
const multer=require("multer");

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        let text=path.extname(file.originalname)
        cb(null,Date.now()+text)
    }
})

var upload=multer({
    storage:storage,
    fileFilter:function(req,file,callback){
        if(file.mimetype=="image/png" ||file.mimetype=="image/jpg"){
            callback(null,true)
        }
        else{
            console.log("only this image")
        }
    },
    limits:{
        fileSize:1024*1024*2
    }
})
module.exports=upload