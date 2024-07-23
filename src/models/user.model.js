const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username:{
            types: String ,
            required:true,
            unique:true
        },
        email:{
            types: String ,
            required:true,
            unique:true
        },
        password:{
            types:String,
            required:true
        },
        isAdmin: {
            types:Boolean,
            default:false
        },
        
    },{timestamps:true}
)
const User = mongoose.model('User', userSchema);
module.exports = User;