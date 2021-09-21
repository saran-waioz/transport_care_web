const express=require("express")
const router=express.Router();
const Usercontroller=require('../controllers/users')
const CronJob = require('cron').CronJob;
new CronJob('*/1 * * * *', Usercontroller.caregiver_reminder_cron, null, true);

router.post('/get_users',Usercontroller.get_users)
router.post('/get_reviews',Usercontroller.get_reviews)
router.post('/export_get_user',Usercontroller.get_export_user)
router.post('/get_user_detail',Usercontroller.get_user_detail)
router.post('/delete_user',Usercontroller.delete_user)
router.post('/update_driver_status',Usercontroller.update_driver_status)
router.post('/get_caregiver', Usercontroller.get_caregiver);
router.post('/add_user_caregiver', Usercontroller.add_user_caregiver);
router.post('/get_user_caregiver', Usercontroller.get_user_caregiver);
router.post('/delete_user_caregiver', Usercontroller.delete_user_caregiver);
router.post('/add_driver_attender', Usercontroller.add_driver_attender);
router.post('/get_driver_attender', Usercontroller.get_driver_attender);
router.post('/add_user_feedback', Usercontroller.add_user_feedback);
router.post('/update_profile', Usercontroller.update_profile);
router.post('/delete_driver_attender', Usercontroller.delete_driver_attender);
router.post('/update_availability_status', Usercontroller.update_availability_status);
router.post('/get_home_page_detail', Usercontroller.get_home_page_details);
router.post('/calculate_fare_estimation', Usercontroller.calculate_fare_estimation);
router.post('/update_trip_status', Usercontroller.update_trip_status);
router.post('/accept_request', Usercontroller.accept_request);
router.post('/cancel_request', Usercontroller.cancel_request);
router.post('/request_order', Usercontroller.request_order);
router.post('/get_trips', Usercontroller.get_trips);
router.post('/rate_user', Usercontroller.rate_user);
router.post('/rate_driver', Usercontroller.rate_driver);
router.post('/create_stripe_token', Usercontroller.create_stripe_token);
router.post('/add_wallet', Usercontroller.add_wallet);
router.post('/get_wallet_data', Usercontroller.get_wallet_data);
router.post('/trip_payment', Usercontroller.trip_payment);
router.post('/trip_update', Usercontroller.trip_update);
router.post('/get_stripe_cards', Usercontroller.get_stripe_cards);
router.post('/add_stripe_card', Usercontroller.add_stripe_card);
router.post('/add_stripe_external_card', Usercontroller.add_stripe_external_card);
router.post('/driver_payout', Usercontroller.driver_payout);
router.post('/delete_stripe_card', Usercontroller.delete_stripe_card);
router.post('/get_logs', Usercontroller.get_logs);
router.post('/get_driver_status', Usercontroller.get_driver_status);
router.post('/create_bank',Usercontroller.create_bank)
router.post('/get_others_chart',Usercontroller.get_others_chart)
router.post('/get_earnings_chart',Usercontroller.get_earnings_chart)
router.post('/get_booking_chart',Usercontroller.get_booking_chart)
// router.post('/get_users',Usercontroller.get_users)

module.exports = router;
