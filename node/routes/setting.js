const express=require("express")
const router=express.Router();
const Settingcontroller=require('../controllers/settings')

router.post("/get_settings",Settingcontroller.get_settings)
router.post("/update_settings",Settingcontroller.update_settings)


module.exports = router;
