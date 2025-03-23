import express from 'express';
import { login, signup,logout} from "../controller/buyerController.js";
import {protectBuyerRoute} from "../middleware/authBuyermiddleware.js"
import { check } from '../controller/salerController.js';
 export const authBuyerRouter=express.Router();

 authBuyerRouter.post("/signup",signup);
 authBuyerRouter.post("/login",login);
 authBuyerRouter.post("/logout",logout);
 authBuyerRouter.get("/check",protectBuyerRoute,check);

  