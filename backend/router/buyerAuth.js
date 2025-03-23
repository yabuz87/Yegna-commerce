import express from 'express';
import { login, signup,logout } from "../controller/buyerController.js";
 export const authBuyerRouter=express.Router();

 authBuyerRouter.post("/signup",signup);
 authBuyerRouter.post("/login",login);
 authBuyerRouter.post("/logout",logout)

  