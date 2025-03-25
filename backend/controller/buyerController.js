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
        res.status(409).json({"message":"user has already registered"});
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
export const getOneProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from the route parameter
        const userId = req.user._id; // Get the authenticated user's ID

        // Find the product by its ID
        const product = await electronicsProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "There is no product with this ID" });
        }

        // Initialize `views` if undefined
        if (!product.views) {
            product.views = { users: [], count: 0 }; // Initialize views with users array and count
        }

        // Ensure `views.users` is properly initialized
        if (!Array.isArray(product.views.users)) {
            product.views.users = [];
        }

        // Check if the user has already viewed the product
        const isAlreadySeen = product.views.users.some(
            (view) => view.userId?.toString() === userId.toString()
        );

        if (!isAlreadySeen) {
             // Add the user's view
        product.views.users.push({ userId, timestamp: Date.now() }); // Store userId and timestamp of the view
        product.views.count++; // Increment the view count

        // Save the updated product
        await product.save();

        console.log("View updated successfully");
        }

       
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in the getOneProduct method:", error.message);
        res.status(500).json({ message: "An error occurred while fetching the product", error: error.message });
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
export const commentProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from the request
        const userId = req.user._id; // Extract user ID from the authenticated request
        const { text } = req.body; // Extract the comment text from the request body

        // Find the product using 'findById' method
        const product = await electronicsProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // Return if the product doesn't exist
        }

        // Ensure `comments` is properly initialized as an array
        if (!Array.isArray(product.comments)) {
            product.comments = []; // Initialize comments as an empty array
        }

        // Add a new comment object to the `comments` array
        product.comments.push({
            userId, // The ID of the user making the comment
            text, // The content of the comment
            timestamps: Date.now() // Automatically record the timestamp
        });

        // Save the updated product with the new comment
        await product.save();

        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error in the commentProduct method:", error.message);
        res.status(500).json({ message: "An error occurred while adding the comment", error: error.message });
    }
};
export const updateView=async(req,res)=>{

}
export const addFavourite = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from the request
        const userId = req.user._id; // Extract user ID from the authenticated request

        // Find the product using 'findById' method
        const product = await electronicsProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "There is no product like this" });
        }

        // Find the user in the database
        const user = await Buyer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }

        // Initialize favourites if not defined in the user's schema
        if (!user.favourites.productId) {
            user.favourites.productId = []; // Ensure productId is an array
        }

        // Check if the product is already in the user's favourites
        const productAlreadyIn = user.favourites.productId.includes(productId.toString());

        if (productAlreadyIn) {
            return res.status(403).json({ message: "Product is already in favourites" });
        }

        // Add the product to the user's favourites
        user.favourites.productId.push(productId); // Add the product ID to the array
        user.favourites.count++; // Increment the count

        // Save the updated user
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
