const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
        amount:{types:Number , required:true},
        address:{types:String, required:true},
        status:{types:String, default:"Pending"}
    }, { timestamps: true }
)
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;