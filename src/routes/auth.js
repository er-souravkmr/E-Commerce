const router = require('express').Router();
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
//Register
router.post('/register',async (req,res)=>{
   const {username,password,email,isAdmin} = req.body;

   const newUser = new User({
        username:username,
        password:password,
        email:email,
        isAdmin:isAdmin
   });

   try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
   } catch (error) {
     res.status(500).json(error)
   }
})

//Login 

router.post('/login',async (req,res)=>{
    const {username} = req.body;
    
    if(!username) return res.status(400).json("Username is Req");

   try {
     const user = await User.findOne({username : username});
     if(!user) return res.status(400).json("Wrong Credentails");

     const pass = await user.isPasswordCorrect(req.body.password); 
     if(!pass) return res.status(400).json("Wrong password");

     const {password , ...others} = user._doc;

     const accessToken = jwt.sign(
      {
        id:others?._id,
        isAdmin:others?.isAdmin
      },
      process.env.SECRET_KEY,
      {expiresIn:process.env.EXPIRY}
    );
    

     res.status(200).json({msg:"Pasword Matched", data: others ,accessToken:accessToken});

   } catch (error) {
      console.log(error)
      res.status(500).json(error)
   }
})



module.exports = router;