const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
let Currency = mongoose.Types.Currency;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true
    },
    release: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;