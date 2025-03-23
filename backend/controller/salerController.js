import bcrypt from "bcrypt"
import { generateToken } from "../lib/util.js";
import Saler from "../model/saler.user.js";



export const signup=async(req,res)=>{
    try {
        const {fullName,email,password,phone,address}=req.body;
    const saler=await Saler.findOne({email});
    const isPhoneNumberthere=await Saler.findOne({phone});
    if(saler)
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
    const newSaler=new Saler({
        fullName,
        email,
        password:hashedPassword,
        phone,
        address
    });
    if(newSaler)
    {
        generateToken(newSaler._id,res)
        await newSaler.save();
        res.status(201).json({
            fullName:newSaler.fullName,
            email:newSaler.email,
            phone:newSaler.phone,
            address:newSaler.address,
            rating:newSaler.rating
        })
    }
    } catch (error) {
        console.log("there is error in signup method");
        res.status(500).json({"message":error.message});
    }
    
}

export const login=async(req,res)=>{
    const {email,password,phone}=req.body;
    const saler=await Saler.findOne({email});
    if(!saler)
    {
        res.status(400).json({"message":"there is no user in this email"});
    }
    const isPassword=await bcrypt.compare(password,saler.password);
    if(!isPassword)
    {
            res.status(400).json({"message":"invalid cridentials"});
    }
    
    const token=generateToken(saler._id,res);
    res.status(200).json({
       fullName:saler.fullName,
            email:saler.email,
            phone:saler.phone,
            address:saler.address,
            rating:saler.rating
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