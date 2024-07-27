const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const {verifyToken , verifyTokenAndAdmin} = require('../middleware/auth.middleware.js');
const User = require('../models/user.model.js');

router.route('/updatePass/:id').post(verifyToken ,async (req,res)=>{
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