const express=require('express');
const router = express.Router();
const User=require('../models/user');
const Product=require('../models/product');
const {authorize,login,signUp,addProduct,assignDriver,getAllOrders,getAllProducts,getAllUsers,getDrivers} =require('../controllers/admin')

router.post('/signup',signUp)
router.post('/login',login)
router.post('/addproduct',authorize,addProduct)
router.post('/assigndriver', authorize , assignDriver)
router.get('/getorders',authorize,getAllOrders)
router.get('/getproducts',authorize,getAllProducts)
router.get('/getusers',authorize,getAllUsers)
router.get('/getdrivers',authorize,getDrivers)


module.exports = router;


