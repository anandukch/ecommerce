
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const Product = require('../models/product');
const Order=require('../models/order');
const bcrypt=require('bcryptjs');
module.exports.authorize = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];     
        decodedData = jwt.verify(token,  process.env.JWT);
        const _user=await User.findOne({_id:decodedData.id,type:decodedData.type});
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
          type:'driver'
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
  module.exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.find({driver:req.user._id});
      res.status(200).json({orders});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  module.exports.updateOrderStatus = async (req, res) => {

    const {status} = req.body;
    const {id} = req.params;
 
    try {
      const order = await Order.findOne({_id:id});
      if(!order) return res.status(404).json({message:'Order not found'});
      if(order.status==status) return res.status(400).json({message:'Order status already updated'});
      order.status=status;
      await order.save();
      res.status(200).json({message:'Order status updated'});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }



