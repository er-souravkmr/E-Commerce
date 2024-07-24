const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            types: String,
            required: true,
        },
        products: [
            {
                productId: {
                    types: String
                },
                quantity: {
                    types: Number,
                    default: 1
                }
            }
        ],
    }, { timestamps: true }
)
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;