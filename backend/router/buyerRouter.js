import express from 'express';
import { login, signup,logout,getProducts, rateProduct, likeProduct, commentProduct, addFavourite, getFavourites, getOneProduct,} from "../controller/buyerController.js";
import {protectBuyerRoute} from "../middleware/authBuyermiddleware.js"
import { check } from '../controller/salerController.js';
 export const buyerRouter=express.Router();

//  authentication
 buyerRouter.post("/signup",signup);
 buyerRouter.post("/login",login);
 buyerRouter.post("/logout",logout);
 buyerRouter.get("/check",protectBuyerRoute,check);

//   other methods of buyers

buyerRouter.get("/getProducts",protectBuyerRoute,getProducts);
buyerRouter.put("/rate/:id",protectBuyerRoute,rateProduct);
buyerRouter.put("/likeProduct/:id",protectBuyerRoute,likeProduct);
buyerRouter.put("/commentProduct/:id",protectBuyerRoute,commentProduct);
buyerRouter.get("/oneProduct/:id",protectBuyerRoute,getOneProduct);
buyerRouter.put("/addFavourite/:id",protectBuyerRoute,addFavourite);
buyerRouter.get("/getFavourites",protectBuyerRoute,getFavourites);

