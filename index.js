const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()

const userRouter = require('./src/routes/user.route.js');

const mongoose = require('mongoose');
mongoose.connect(`${process.env.DB_CONN}`)
.then(()=>{
    console.log("DB Connection Successfull");
})
.catch((err)=>{
    console.log(err);
    process.exit(1);
})


app.use(express.json());
app.use("/api/user", userRouter);
app.listen(process.env.PORT ,(err)=>{
    if(err) console.log(err);
    console.log(`Backend Server is connected at ${process.env.PORT}`);
})

