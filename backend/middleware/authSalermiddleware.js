import jwt from "jsonwebtoken";
import Saler from "../model/saler.user.js";
export const protectSalerRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ "message": "unauthorized- No token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ "message": "unauthorized- No token Provided" });
        }
        const user = await Saler.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ "message": "user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in protectedRoute middleware", error.message);
        res.status(500).json({ message: "internal error" });
    }
}
