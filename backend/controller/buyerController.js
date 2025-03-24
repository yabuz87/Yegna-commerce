import Buyer from "../model/buyer.user.js"
import { generateToken } from "../lib/util.js";
import electronicsProduct from "../model/electronics.product.js";
import Saler from "../model/saler.user.js";
import bcrypt from 'bcrypt';


// buyer authentication
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
export const check=async(req,res)=>
{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("ther is error in check method check it out");
        res.status(500).json({"message":error.message});
    }
}





// buyer methods


// export const getRecomendedProducts=async(req,res)=>
// {

// };


export const getProducts=async(req,res)=>
{
    try {
        const products=await electronicsProduct.find({});
        if(!products)
        {
            res.status(404).json({"message":"product not find"});
        }
        res.status(200).json(products);
    } catch (error) {
        console.log("there is error to getProducts method in buyerController file check");
        res.status(500).json({"message":error.message});
        
    }

};
export const rateProduct=async(req,res)=>
{
    productId=req.params.id;
    userId=req.user._id;
    const alreadyLiked = product.likes.users.some(
        (like) => like.userId?.toString() === userId?.toString()
    );
   

};
export const likeProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from request parameters
        const userId = req.user?._id; // Safely access user ID (handle potential undefined)

        if (!userId) {
            return res.status(400).json({ message: "User information is missing" }); // Handle missing user ID
        }

        const product = await electronicsProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        // Check if the user has already liked the product
        const alreadyLiked = product.likes.users.some(
            (like) => like.userId?.toString() === userId?.toString()
        );

        if (alreadyLiked) {
            return res.status(403).json({ message: "User has already liked this product" });
        }

        // Add a new like
        product.likes.users.push({ userId, timestamp: Date.now() });
        product.likes.count++;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: "Product liked successfully" });
    } catch (error) {
        console.error("Error in the likeProduct method:", error.message);
        res.status(500).json({ message: "An error occurred while liking the product", error: error.message });
    }
};
export const commentProduct=async(req,res)=>
{
        const productId = req.params.id; 
        const userId = req.user._id;
        const {text}=req.body;
        const product=await electronicsProduct.findById(productId);

        if (!product.comments) {
            product.comments= { users: [], count: 0 }; // Initialize likes property if undefined
        }
        if (!product.comments.users.includes(userId)) {
            product.comments.users.push(userId); // Add user ID to likes
            product.comments.timestamps.push(Date.now) 
            product.comments.text.push(text);
        }


};
export const addFavourite = async (req, res) => {
    try {
        const productId = req.params.id; 
        const userId = req.user._id;
        const product = await electronicsProduct.findById(productId);
        const user=await Buyer.findById(userId);
        if(!user)
        {
            res.status(403).json({"message":"there is no user in this id"});
        }

        if (!product) { 
            return res.status(404).json({ message: "There is no product like this" }); // Return if product not found
        }

        const productAlreadyIn = user.favourites.productId.some(
            (favourites) => favourites.productId?.toString() === productId.toString()
        );

        if (productAlreadyIn) {
            return res.status(403).json({ message: "Product is already in favourites" }); // Forbidden for duplicate additions
        }

        product.favourites.push({ productId, timestamp: Date.now() });

        await user.save();

        res.status(200).json({ message: "Product has been added to favourites" });
    } catch (error) {
        console.error("There is an error in the addFavourite method:", error.message);
        res.status(500).json({ message: "An error occurred while adding to favourites", error: error.message });
    }
};

export const getFavourites=async(req,res)=>
{
    try {
        
    const userId=req.user._id;
    const user=await Buyer.findById(userId);
    if(!user){
        return res.status(400).json("no user in this id");
    }
   const products=user.favourites;
    res.status(200).json(products);
    } catch (error) {
        console.error("There is an error in the getFavourite method:", error.message);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}