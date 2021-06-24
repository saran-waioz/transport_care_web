const express=require("express")
const router=express.Router();
const CategoryController=require("../controllers/category")

router.post('/update_category',CategoryController.update_category)
router.post('/get_category',CategoryController.get_category)
router.post('/delete_category',CategoryController.delete_category)
router.post('/get_vehicle_category', CategoryController.get_vehicle_category);

module.exports = router;
