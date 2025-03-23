import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import productRoute from "./router/productRouters.js";
import connect from "./lib/mongodb.js" 
import authRouter from "./router/salerAuth.js";
import {authBuyerRouter} from "./router/buyerAuth.js"
const port=process.env.PORT || 4000
 dotenv.config();
const app=express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use("/product",productRoute);
app.use("/authSaler",authRouter);
app.use("/authBuyer",authBuyerRouter);
app.get("/",(req,res)=>{
    console.log("hey there, this one is the begining of your long run on yegna commerce ryt ?")
    res.json({"message":"hey there, this one is the begining of your long run on yegna commerce ryt ?"})
})
app.listen(port,()=>
{
    connect();
    console.log(`server is listening port ${port}`)
})