import jwt from "jsonwebtoken"

export const generateToken=(userId,rea)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("jwt",token,{
        maxAge:3*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !="development"
    })
}