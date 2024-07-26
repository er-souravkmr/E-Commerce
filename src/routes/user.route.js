const router = require('express').Router();
const {verifyToken} = require('../middleware/verifyToken.middleware.js')

router.route('/test').get(verifyToken ,(req,res)=>{
   res.status(200).json("Working Fine")
})


module.exports = router;