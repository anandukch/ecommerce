
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    type: {
        type: String,
        enum: ['customer', 'admin', 'driver'],
        default: 'customer',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,

    },
    address: {
        type: String,
        
    },
    cart: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
});
userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    }
    next();
  });
const User = mongoose.model('User', userSchema);
module.exports = User;

