const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const {verifyToken , verifyTokenAndAdmin} = require('../middleware/auth.middleware.js');
const User = require('../models/user.model.js');


router.route('/updateUser').post(verifyToken , async(req,res)=>{
  try {
    const {email,username} = req.body;
    if(!email && !username) return  res.status(403).json("User Details is required for updating");
  
    const user = await User.findByIdAndUpdate(req?.user?.id , 
      {
        $set: {email,username}
      },
      {new:true}
    ).select("-password");
  
    if(!user) return  res.status(500).json("Can't Update User Please Try Again Later");
  
    return  res.status(200).json({msg:"Account Details Updated",data:user});
  } catch (error) {
    console.log(error);
    if(!user) return  res.status(500).json("Can't Update User Please Try Again Later");
  }
})


router.route('/updatePass').post(verifyToken ,async (req,res)=>{
  try {
    const {password , newPassword} = req.body
    const id = req.user?.id

    const user = await User.findById(id);
    if(!user) return res.status(200).json("Provide Valid User");
   
    const check = await user.isPasswordCorrect(password);
    const newpass = await user.isPasswordCorrect(newPassword);

    if(!check) return res.status(200).json("Old Password is incorrect");
    if(newpass) return res.status(200).json("Old Password is same as new");
 
    user.password = newPassword;
    user.save({validateBeforeSave:false});
    
    return res.status(200).json("Password Changed");
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:error});
  }
})


module.exports = router;