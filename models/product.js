
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {

        type: String,
        required: true
    },
    locations: {
        type: Array,
        required: true
    },
    
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
