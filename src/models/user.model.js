const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true
        },
        email:{
            type: String ,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        isAdmin: {
            type:Boolean,
            default:false
        },
        
    },{timestamps:true}
)

//Making HAsh befoe saving to db;
userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});

//Compare password 
userSchema.methods.isPasswordCorrect =  async function(password){
    return await bcrypt.compareSync(password,this.password);
}
 
const User = mongoose.model('User', userSchema);
module.exports = User;