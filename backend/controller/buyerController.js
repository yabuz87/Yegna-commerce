import Buyer from "../model/buyer.user.js"
import { generateToken } from "../lib/util.js";
import bcrypt from 'bcrypt';

export const signup=async(req,res)=>{
    try {
        const {fullName,email,password,phone}=req.body;
    const user=await Buyer.findOne({email});
    const isPhoneNumberthere=await Buyer.findOne({phone});
    if(user)
    {
        res.status(404).json({"message":"user has already registered"});
    }
    if(isPhoneNumberthere)
    {
        res.status(404).json({"message":"Phone Number has already registered"});   
    }
    if(password.length<6)
    {
        res.status(400).json({"message":"password must be greater than 6"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=new Buyer({
        fullName,
        email,
        password:hashedPassword,
        phone,
    });
    if(newUser)
    {
        generateToken(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            fullName:newUser.fullName,
            email:newUser.email,
            phone:newUser.phone,
            status:newUser.status,

        })
    }
    } catch (error) {
        console.log("there is error in signup method");
        res.status(500).json({"message":error.message});
    }
    
}

export const login=async(req,res)=>{
    const {email,password,phone}=req.body;
    const user=await Buyer.findOne({email});
    if(!user)
    {
        res.status(400).json({"message":"there is no user in this email"});
    }
    const isPassword=await bcrypt.compare(password,user.password);
    if(!isPassword)
    {
            res.status(400).json({"message":"invalid cridentials"});
    }
    
    const token=generateToken(user._id,res);
    res.status(200).json({
       fullName:user.fullName,
            email:user.email,
            phone:user.phone,
           status:user.status
    })



}

export const logout=async(req,res)=>
{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({"message":"Loggedout successfully"})
    } catch (error) {
        console.log("there is error in logout method check it our");
        res.status(500).json({"message":error.message});
    }
}
