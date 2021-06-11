const express=require("express")
const router=express.Router();
const Usercontroller=require('../controllers/users')

router.post('/get_users',Usercontroller.get_users)
router.post('/export_get_user',Usercontroller.get_export_user)
router.post('/get_user_detail',Usercontroller.get_user_detail)
router.post('/delete_user',Usercontroller.delete_user)
router.post('/update_driver_status',Usercontroller.update_driver_status)
// router.post('/get_pagination',Usercontroller.get_pagination)
router.post('/get_users',Usercontroller.get_users)


module.exports = router;
