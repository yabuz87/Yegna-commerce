import bcrypt from "bcrypt";
import { generateToken } from "../lib/util.js";
import electronicsProduct from "../model/electronics.product.js";
import Saler from "../model/saler.user.js";




// saler authentication
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
export const check=async(req,res)=>
{
    try {
        res.status(200).json(req.user);
    } catch (error){
        console.log("there is error in check method in salerController");    
        res.status(500).json({"message":error.message});    
    }
}
// saler methods 
export const  myProducts=async(req,res)=>
{
    try {
        
  const userId=req.user._id;
    if(!userId)
    {
        res.status(400).json({"message":"there is no saler id"});
    }
    const products=await electronicsProduct.find({salerId:userId});
    res.status(200).json(products);
    } catch (error) {
        console.log("there is error in myProducts method in salerController file check it out");
        res.status(500).json({"message":error.message});
    }
}

export const addProduct = async (req, res) => {
    try {
       const  userId=req.user._id;
    if(!userId)
    {
        res.status(400).json({"message":"there is no saler id"});
    }
      const {
        name,
        model,
        price,
        category,
        spec,
        productDate,
      } = req.body;
  
      // Validate the spec field
      if (spec && typeof spec !== 'object') {
        return res.status(400).json({ message: "Invalid spec field format. It must be an object with string values." });
      }
  
      // Create a new product instance
      const newProduct = new electronicsProduct({
        name,
        model,
        price,
        category,
        spec, // Ensure spec follows Map format
        productDate,
        salerId:userId,
      });
  
      // Save to the database
      await newProduct.save();
      res.status(201).json({ message: "Product saved successfully", data: newProduct });
    } catch (error) {
      console.error("Error in putProduct method:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
export const deleteProduct=async(req,res)=>{
  try {
  const userId=req.user._id;

   let  productId=req.params.id;
   productId=productId.toString();
    const product=await electronicsProduct.findById(productId);
    const isOwner = userId.toString() === product.salerId.toString();
    if(!isOwner)
    {
        res.status.json({"message":"wrong Saler id"});
    }
        await electronicsProduct.findByIdAndDelete(productId);
        res.status(200).json(product);

  } catch (error) {
    console.log("there is error in deleteProduct method in salerController file check that one");
    res.status(500).json({"message":error.message});
    
  }

};
export const editProduct = async (req, res) => {
    try {
    
     const userId=req.user._id;
      const productId = req.params.id; // Extract product ID from the request
      const updates = req.body; // Get updates from the request body
  
      const product = await electronicsProduct.findById(productId); // Find the product by ID
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
     
    const isOwner = userId.toString() === product.salerId.toString();
      if (!isOwner) {
        console.log(userId);
        return res.status(403).json({ message: "Unauthorized: wrong seller ID" });
        
      }
  
      // Update the product with the new attributes
      Object.keys(updates).forEach((key) => {
        product[key] = updates[key];
      });
  
      await product.save();
  
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };

export const oneProduct=async(req,res)=>
{
    
}

export const getHistory=async(req,res)=>
{
  

}