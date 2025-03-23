import express from "express"
import { login, signup,logout,check} from "../controller/salerController.js";
import {protectSalerRoute} from "../middleware/authSalermiddleware.js";
const authRouter=express.Router();


authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout)
authRouter.get("/check",protectSalerRoute,check);

export default authRouter;