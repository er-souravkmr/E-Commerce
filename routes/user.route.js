const router = require('express').Router();

router.get('/test',(req,res)=>{
   res.send('Testing')
})


module.exports = router;