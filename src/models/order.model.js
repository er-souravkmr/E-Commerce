const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        amount:{type:String , required:true},
        address:{type:String, required:true},
        status:{type:String, default:"Pending"}
    }, { timestamps: true }
)
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;