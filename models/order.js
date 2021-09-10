
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" } ,
     quantity: Number,
    location:String}
  ],

  status: {
    type: String,
    default: "pending",
  },

});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;