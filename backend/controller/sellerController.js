import bcrypt from "bcrypt"
import { generateToken } from "../lib/util";
import Saler from "../model/saler.user";



export const signup=async(req,res)=>{
    const {fullName,email,password,phone,address}=req.body;
    const saler=await Saler.findOne({email});
    if(!saler)
    {
        res.status(404).json({"message":"user has already registered"});
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
    
}