const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    item: {
        type: Array,
        required: true
    },
    notice: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;