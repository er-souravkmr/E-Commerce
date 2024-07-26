const router = require('express').Router();
const User = require('../models/user.model.js')

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
    const {username , password} = req.body;
    console.log(password)
    if(!username) return res.status(400).json("Username is Req");

   try {
     const user = await User.findOne({username : username});
     if(!user) return res.status(400).json("Wrong Credentails");
     console.log(user);
     
     const pass = await user.isPasswordCorrect(password); // Taking Time To Resolve
     if(!pass) return res.status(400).json("Wrong password");
     console.log(pass);


     res.status(200).json({msg:"Pasword Matched"})
   } catch (error) {
        res.status(500).json(error)
   }
})



module.exports = router;