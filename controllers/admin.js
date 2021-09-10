
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const Product = require('../models/product');
const Order=require('../models/order');
const bcrypt=require('bcryptjs');
module.exports.authorize = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];     
        decodedData = jwt.verify(token,  process.env.JWT);
        // console.log(decodedData);
        let _user=await User.findOne({_id:decodedData.id,type:decodedData.type});
        if(_user) req.user = _user
        else return res.status(401).json({message:'Unauthorized'})
      next();
    } catch (error) {
      res.status(404).json({message:'token not found'})
    }
  };
  
  module.exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found" });
      const isValid = bcrypt.compareSync(password, user.password);
  
      if (!isValid)
      
        return res.status(400).json({ message: "password not match" });
      const token = jwt.sign({ type: user.type, id: user._id },  process.env.JWT, {
        expiresIn: "1h",
      });
      
      res.status(200).json({ token, user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.signUp = async (req, res) => {
   
    const { name, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
      const newUser = new User({
          name,
          email,
          password,
          type:'admin'
      });
  
      await newUser.save((err, user) => {
        if (err) return res.status(500).json({ message: err.message });
        const token = jwt.sign({ type: user.type, id: user._id },  process.env.JWT, {
          expiresIn: "1h",
        });
        res.status(201).json({ user, token });
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

  module.exports.getAllUsers = async (req, res) => {

    try {
      let users = await User.find({type:'user'});
      res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  module.exports.getAllProducts = async (req, res) => {
      
    try {
      let products = await Product.find();
      res.status(200).json({ products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  module.exports.getAllOrders = async (req, res) => {
      
    const {status}=req.body;
    try {
      let orders = await Order.find({status});
      res.status(200).json({ orders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
  module.exports.addProduct = async (req, res) => {
    const {name,category,locations}=req.body;

    try {
      const product=await Product({
        name,
        category,
        locations
    })
    product.save();
      res.status(201).json({ product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
  module.exports.getDrivers = async (req, res) => {
    
    try {
      let drivers = await User.find({type:'driver'});
      res.status(200).json({ drivers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
  module.exports.assignDriver = async (req, res) => {
    const {driverId,orderId}=req.body;

    try {
      let order=await Order.findById(orderId);
      order.driver=driverId;
      await order.save();
      res.status(200).json({ order });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }




  