import electronicsProduct from "../model/electronics.product.js";
import Seler from "../model/saler.user.js"
import axios from "axios"
import redis from "redis"
import mongoose from "mongoose"

export const getAllProducts= async (req,res)=>
{
try {
  
  const products= await electronicsProduct.find({});
    res.status(200).json(products);
} catch (error) {
  console.log("there is error in getAllProducts method check it out");
  res.status(500).json({"message":error.message})
}

}

export const searchProduct = async (req, res) => {
  try {
    const { name, price, category, model } = req.body;

    // Build the query dynamically
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match for name
    if (price) query.price = { $lte: price }; // Price less than or equal to the given value
    if (category) query.category = { $regex: category, $options: "i" }; // Case-insensitive match for category
    if (model) query.model = { $regex: model, $options: "i" }; // Case-insensitive match for model

    // Perform the search
    const foundProducts = await electronicsProduct.find(query);



    // Handle the results
    if (foundProducts.length > 0) {
     
      res.status(200).json(foundProducts);

    } else {
      res.status(404).json({ message: "No matching products found" });
    }
  } catch (error) {
    console.error("Error in searchProduct method:", error);
    res.status(500).json({ message: error.message });
  }
};



export const findOneProduct = async (req, res) => {
  try {
    console.log("Step 1: Received Product ID:", req.params.id);
    const productId = req.params.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID!" });
    }

    // Retrieve product
    const foundProduct = await electronicsProduct.findById(productId);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }
    console.log("Step 2: Found Product:", foundProduct);

    // Increment views count and update interaction counts
    const userId = req.user?.id; // Assuming you're tracking userId
    const updatedProduct = await electronicsProduct.findByIdAndUpdate(
      productId,
      {
        $inc: { 
            "views.count": 1, 
            "interactionCounts.views": 1 // Both fields incremented simultaneously
        },
        $addToSet: { "views.users": userId} // Add userId to users array
      },
      { new: true } // Return the updated document
    );
    console.log("Step 3: Updated Product:", updatedProduct);

    // Retrieve seller information
    const sellerId = updatedProduct.salerId;
    const sellerUser = await Seler.findById(sellerId);
    console.log("Step 4: Found Seller:", sellerUser);

    // Build response
    const fullInfoAboutProduct = sellerUser
      ? { updatedProduct, sellerUser }
      : { updatedProduct };
    console.log("Step 5: Full Info About Product:", fullInfoAboutProduct);

    res.status(200).json(fullInfoAboutProduct);
  } catch (error) {
    console.error("Error in getOneProduct method, check it out:", error);
    res.status(500).json({ message: error.message });
  }
};


export const filterProducts = async (req, res) => {
  try {
    const { name, price, model, category, recommendationStatus } = req.body;

    // Build the query dynamically
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match for name
    if (price) query.price = { $lte: price }; // Price less than or equal to the given value
    if (category) query.category = { $regex: category, $options: "i" }; // Case-insensitive match for category
    if (model) query.model = { $regex: model, $options: "i" }; // Case-insensitive match for model
    if (recommendationStatus) query.recommendationStatus = recommendationStatus; // Exact match for numeric field

    // Perform the search
    const filteredProduct = await electronicsProduct.find(query);
    res.status(200).json(filteredProduct);
  } catch (error) {
    console.error("Error in sortProducts method, check it out:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFeedPageProducts = async () => {
  try {
    // Step 1: Retrieve products with relevant fields
    const products = await electronicsProduct.find({}, { 
      _id: 1, 
      recommendationStatus: 1, 
      "views.count": 1, 
      likes: 1, 
      category: 1 
    });

    q// Step 2: Send the products to the ML model for updated recommendations
    const modelInput = products.map(product => ({
      id: product._id,
      viewsCount: product.views?.count || 0, // Handles cases where views.count might not exist
      likes: product.likes || 0,
      category: product.category,
    }));

    // Assuming you have a machine learning model running as a service/API
    const response = await axios.post("http://your-ml-model-endpoint.com/predict", modelInput);
    const updatedRecommendations = response.data; // Model returns updated recommendation statuses

    // 1. Hugging Face Inference API

    // Step 3: Update the recommendationStatus in the database
    for (const recommendation of updatedRecommendations) {
      await electronicsProduct.updateOne(
        { _id: recommendation.id },
        { $set: { recommendationStatus: recommendation.recommendationStatus } }
      );
    }

    console.log("Successfully updated recommendationStatus for all products.");
    return { message: "Recommendation statuses updated successfully" };
  } catch (error) {
    console.error("Error in getFeedPageProducts method:", error);
    throw new Error("Failed to update product recommendations");
  }
};




// export const addProduct = async (req, res) => {
//     try {
//       const {
//         name,
//         model,
//         price,
//         category,
//         spec,
//         productDate,
//       } = req.body;
  
//       // Validate the spec field
//       if (spec && typeof spec !== 'object') {
//         return res.status(400).json({ message: "Invalid spec field format. It must be an object with string values." });
//       }
  
//       // Create a new product instance
//       const newProduct = new electronicsProduct({
//         name,
//         model,
//         price,
//         category,
//         spec, // Ensure spec follows Map format
//         productDate,
//         salerId,
//       });
  
//       // Save to the database
//       await newProduct.save();
//       res.status(201).json({ message: "Product saved successfully", data: newProduct });
//     } catch (error) {
//       console.error("Error in putProduct method:", error.message);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   };
  
export const deleteProduct=async (req,res)=>{
  try {
    
    const productId=req.params.id;
  console.log("recieved id from the request ",req.params.id);
  const productToDelete=await electronicsProduct.findByIdAndDelete(productId);
  if(!productToDelete)
  {
    res.status(404).json({"message":"product not found"});

  }

  console.log("message product deleted successfully !");
  res.status(200).json(productToDelete)
  
  } catch (error) {
    
    console.log("there is error in the deleteProduct method check it out");
    res.status(500).json({"message":error.message});
  }

}


 const updateProductView = async (req, res) => {
    const { productId } = req.params; // Extract productId from request parameters
    const userId = req.body.userId; // Assuming the userId is sent in the request body
  
    try {
      // Update the product: increment views.count and add userId to views.users
      const updatedProduct = await electronicsProduct.findByIdAndUpdate(
        productId,
        {
          $inc: { 'views.count': 1 }, // Increment views.count by 1
          $push: { 'views.users': userId } // Add userId to views.users array
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product views updated', data: updatedProduct });
    } catch (error) {
      console.error('Error updating product views:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
 
 export const updateProductLike=async (req,res)=>
  {

  }
  export const updateProductComment=async (req,res)=>{
    
  }


