const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()



const mongoose = require('mongoose');
mongoose.connect(`${process.env.DB_CONN}`)
.then(()=>{
    console.log("DB Connection Successfull");
})
.catch((err)=>{
    console.log(err);
    process.exit(1);
})

app.use(express.static("public"));
app.use(express.json({limit:"16kb"}));  
app.use(express.urlencoded({extended:true,limit : "16kb"}))

const userRouter = require('./src/routes/user.route.js');
const authRouter = require('./src/routes/auth.js');
const productRouter = require('./src/routes/product.route.js');

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

app.listen(process.env.PORT ,(err)=>{
    if(err) console.log(err);
    console.log(`Backend Server is connected at ${process.env.PORT}`);
})

