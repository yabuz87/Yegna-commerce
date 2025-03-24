import express from "express"
import { login, signup,logout,check, myProducts,addProduct,editProduct,deleteProduct,getHistory} from "../controller/salerController.js";
import {protectSalerRoute} from "../middleware/authSalermiddleware.js";
const salerRouter=express.Router();

// authentication
salerRouter.post("/signup",signup);
salerRouter.post("/login",login);
salerRouter.post("/logout",logout)
salerRouter.get("/check",protectSalerRoute,check);


// other api router
salerRouter.get("/myProducts",protectSalerRoute,myProducts);
salerRouter.post("/addProduct",protectSalerRoute,addProduct);
salerRouter.delete("/deleteProduct/:id",protectSalerRoute,deleteProduct);
salerRouter.put("/edit/:id",protectSalerRoute,editProduct)
// salerRouter.get("/history",getHistory);
export default salerRouter;