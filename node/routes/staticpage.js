const express=require("express")
const router=express.Router();
const Staticcontroller=require('../controllers/staticpages')

router.post("/static",Staticcontroller.static)

router.post("/get_static",Staticcontroller.get_static)
router.post("/update_static",Staticcontroller.update_static)
router.post("/delete_static",Staticcontroller.delete_static)




module.exports = router;