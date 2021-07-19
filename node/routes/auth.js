const express=require("express")
const router=express.Router();
const AuthController=require("../controllers/auth")

router.post('/sign_up',AuthController.sign_up);
router.post('/sign_in',AuthController.sign_in);
router.post('/send_otp',AuthController.sent_otp);
router.post('/update_otp',AuthController.update_otp)
router.post('/upload_document',AuthController.upload_document)
router.post('/forgot_password',AuthController.forgotPassword)
router.post('/update_user', AuthController.update_user);
//admin
router.post('/admin_login',AuthController.adminlogin)
//
module.exports = router;