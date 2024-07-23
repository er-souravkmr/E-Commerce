const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name:{
            types: String ,
            required:true,
        },
        desc:{
            types: String ,
            required:true,
        },
        image:{
            types:String,
            required:true
        },
        categories: {
            types:Array
        },
        size:{
            types:String,
            required:true
        },
        color: {
            types:String,
            required:true
        },
        price:{
            types:String,
            required:true
        }
        
    },{timestamps:true}
)
const Product = mongoose.model('Product', productSchema);
module.exports = Product;