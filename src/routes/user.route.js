const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const {verifyToken , verifyTokenAndAdmin} = require('../middleware/auth.middleware.js');
const User = require('../models/user.model.js');

//Update User Detail
router.route('/updateUser').patch(verifyToken , async(req,res)=>{
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

//Update Password
router.route('/updatePass').patch(verifyToken ,async (req,res)=>{
  try {
    const {password , newPassword} = req.body
    const id = req.user?.id
    if(!password || !newPassword) return res.status(400).json("Fields are required");


    const user = await User.findById(id);
    if(!user) return res.status(400).json("Provide Valid User");
   
    const check = await user.isPasswordCorrect(password);
    const newpass = await user.isPasswordCorrect(newPassword);

    if(!check) return res.status(400).json("Old Password is incorrect");
    if(newpass) return res.status(400).json("Old Password is same as new");
 
    user.password = newPassword;
    user.save({validateBeforeSave:false});
    
    return res.status(200).json("Password Changed");
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:error});
  }
})

//Get User By Id
router.route('/getById/:userId').get(verifyToken ,async (req,res)=>{

  try {
      const {userId} = req.params;
      if(!isValidObjectId(userId)) return res.status(401).json("Invalid User");
    
      const user = await User.findById(userId).select("-password");
      if(!user) return res.status(401).json("User not Exist");
    
      return res.status(200).json({msg: "User Found" , data: user});
  } catch (error) {
    console.log(error)
    return res.status(200).json({msg: "Can't Find User" , error: error});
  }

})

// get user 
router.route('/').get(verifyToken ,async (req,res)=>{

  try {
      const query = req.query.new;
      const user = query ? await User.find().select("-password").sort({_id:-1}).limit(5) :await User.find().select("-password")
      if(!user) return res.status(200).json("User not Exist");
    
      return res.status(200).json({msg: "User Listed" , data: user});
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg: "Can't Find Users" , error: error});
  }

})

// Delete user
router.route('/deleteUser').delete(verifyToken , async(req,res)=>{
  try {
    const user = await User.findByIdAndDelete(req?.user?.id).select("-password")
    if(!user) return res.status(500).json("Cant Delete Now, Try again Later");
    
    return res.status(200).json({msg: "User Deleted" , data: user});
  } catch (error) {
    console.log(error)
    return res.status(500).json("Cant Delete , Try again");
  }
})

module.exports = router;