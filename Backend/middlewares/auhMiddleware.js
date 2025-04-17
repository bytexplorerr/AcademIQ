import blackListModel from "../models/blackListTokensModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authUser = async (req,res,next)=>{
    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({success:false,message:'Invalid or expired token!'});
        }

        const isBlackListedToken = await blackListModel.findOne({token:token});

        if(isBlackListedToken) {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decode._id);

        if(!user) {
            return res.status(404).json({success:false,message:'User not found!'});
        }

        req.user = user;
        next();

    } catch(err) {
        next(err);
    }
}