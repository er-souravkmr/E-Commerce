const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
   try {
     const headerToken = req.headers.token;
     if(headerToken){
            const token = headerToken;
         jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
             if(err){
                 return res.status(401).json("Token is not Valid!!");  
             }
             req.user = user;
             next();
         })
     }else{
         return res.status(401).json("Unauthorized");
     }
   } catch (error) {
       return res.status(401).json({msg:"Unauthorized",error:error});
   }
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json("You can not do that ! As you are not admin");
        }
    })
  
}

module.exports = {verifyToken,verifyTokenAndAdmin};