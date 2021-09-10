const jwt=require('jsonwebtoken');
const User=require('../models/user');
const Product = require('../models/product');
const Order=require('../models/order');
const bcrypt=require('bcryptjs');
module.exports.authorize = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];     
        decodedData = jwt.verify(token, process.env.JWT);
    
        req.user = decodedData?.id;
 
    
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
      const newUser = new User(req.body);
  
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

  module.exports.placeOrder=async (req, res) => {
    
    try {
        const user = await User.findById(req.user);

        const products = await Product.find({
            _id: {
                $in: user.cart.map((item) => item.product)
            }
        });
        const custOrder= await Order.findOne({customer:user._id});
 
        if(custOrder) return res.status(400).json({message:'order already placed'});
        else{
          const order = new Order({
            customer: user._id,
            products:products.map((item,i) => ({
                    product: item._id,
                    quantity:user.cart[i].quantity,
                    location:item.locations[Math.floor(Math.random() * item.locations.length)]
                    
                })),
                
        });
        await order.save();
        res.json(order);
        }
       
        
        
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
  }

  module.exports.addToCart=async (req, res) => {
    const { id } = req.params;
    // console.log(id,req.user);
  
    try {
        const product = await Product.findById(id);
        const user = await User.findById(req.user);
        const cartProduct = user.cart.find((item) => item.product.toString() === id);
        
        if (!cartProduct) {
            user.cart.push({
                product: product._id,
                quantity: 1,
                
            });
        } else {
            cartProduct.quantity++;
        }
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
  }






