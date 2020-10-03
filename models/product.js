const { Int32, Double } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Double,
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
        type: Int32,
        required: true
    },
    company: {
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