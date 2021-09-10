const express=require('express');
const router = express.Router();
const User=require('../models/user');
const Product=require('../models/product');
const {signUp,login,authorize,getOrders,updateOrderStatus} =require('../controllers/driver')

router.post('/signup',signUp)
router.post('/login',login)
router.get('/orders',authorize,getOrders)
router.put('/order/:id',authorize,updateOrderStatus)



module.exports = router;