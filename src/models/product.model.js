const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String ,
            required:true,
        },
        desc:{
            type: String ,
            required:true,
        },
        image:{
            type:{
                url: String,
                public_id: String,
            },
            required:true
        },
        categories: {
            type:Array
        },
        size:{
            type:String,
            required:true
        },
        color: {
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        }
        
    },{timestamps:true}
)
const Product = mongoose.model('Product', productSchema);
module.exports = Product;