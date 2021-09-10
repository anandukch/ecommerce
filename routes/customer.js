// router setup
const express = require('express');
const router = express.Router();
const jwt=require('jsonwebtoken')
const {login,signUp,authorize,addToCart,placeOrder}=require('../controllers/customer')
const Customer = require('../models/user');
const Product = require('../models/product');

router.post('/signup',signUp)
router.post('/login', login)
router.post('/addtocart/:id',authorize, addToCart);
router.post('/order',authorize,placeOrder)

module.exports=router;