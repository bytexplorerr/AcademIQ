import userModel from "../models/userModel.js";
import {createUser} from "../services/userService.js";
import { validationResult } from "express-validator";
import {SignupMailService,ForgotPasswordMailService} from "../services/mailService.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import blackListModel from "../models/blackListTokensModel.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";

export const Register = async (req,res)=>{
    try { 

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({success:false,error:errors.array()});
        }

        const {name,email,password,role} = req.body;
        const existingUser = await userModel.findOne({email:email});

        if(existingUser) {
            return res.status(400).json({success:false,message:'User already exists!'});
        }

        let userRole;

        if(role !== 'instructor') {
            userRole = 'student';
        } else {
            userRole = 'instructor';
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashedPassword = await userModel.hashPassword(password);

        const user = await createUser({
            name,
            email,
            password:hashedPassword,
            verificationToken,
            role:userRole,
        });

        SignupMailService({
            emailId:email,
            name,
            verificationToken
        });

        return res.status(201).json({success:true,user});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const verifyUser = async (req,res)=>{
    try {

        const {token} = req.params;

        const user = await userModel.findOne({
            verificationToken:token,
            verificationToken:{$exists:true},
        });

        if(!user) {
            return res.status(400).json({success:false,message:'Invalid or expired token!'});
        }

        await userModel.findByIdAndUpdate(user._id,{$unset:{verificationToken:"",expiresAt:""}});

        return res.status(200).json({success:true,message:'User verified successfuly!'});

    } catch(err){
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const Signin = async (req,res)=>{
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({success:false,error:errors.array()});
        }

        const {email,password} = req.body;

        const user = await userModel.findOne({email:email}).select('+password');

        if(!user) {
            return res.status(401).json({success:false,message:'Invalid email or password!'});
        }

        if(user.verificationToken) {
            return res.status(401).json({success:false,message:'Verify your email first!'});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return res.status(401).json({success:false,message:'Invalid email or password!'});
        }

        const token = user.generateAuthToken();

        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'Lax',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({success:true,user});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const ForgotPassword = async (req,res)=>{
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({success:false,message:'All fiels are required!'});
        }

        const {email} = req.body;

        const user = await userModel.findOne({email:email});

        if(!user) {
            return res.status(404).json({success:false,message:'User not found!'});
        }

        const token = user.generateChangePasswordToken();

        ForgotPasswordMailService({
            name:user.name,
            emailId:user.email,
            token:token,
        });

        return res.status(200).json({success:true,message:'Email sent successfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const VerifyPasswordResetToken = async (req,res) =>{
    try {

        const {token} = req.params;

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decode._id);

        if(!user) {
            return res.status(401).json({success:false,message:'Invalid or expired token!'});
        }

        return res.status(200).json({success:true,user});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const ResetPassword = async (req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({success:false,error:errors.array()});
        }

        const {token,newPassword} = req.body;

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decode._id).select("+password");

        if(!user) {
            return res.status(404).json({success:false,message:'Invalid or expired token!'});
        }

        const hashedPassword = await userModel.hashPassword(newPassword);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({success:true,message:'Password changed successfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const GetProfile = async (req,res) =>{
    res.status(200).json({success:true,user:req.user});
}

export const Logout = async (req,res)=>{
    try {
        const {user} = req;
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({success:false,message:'No token found, already logout!'});
        }

        await blackListModel.create({token});

        res.clearCookie('token');

        return res.status(200).json({success:true,message:'Logout successfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const EditProfile = async (req,res)=>{
    try {

        const {_id} = req.user;
        const {name} = req.body;
        const profilePhoto = req.file;

        if(name.length < 3) {
            return res.status(400).json({success:false,message:'Name should be at least 3 characters long'});
        }

        if(!_id) {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const user = await userModel.findById(_id);

        if(!user) {
            return res.status(404).json({success:false,message:'User Not Found!'});
        }

        if(user.photoURL && profilePhoto) {
            const publicID = user.photoURL.split("/").pop().split(".")[0];
            await deleteMedia(publicID);
        }

        if(profilePhoto) {
            const cloudResponse = await uploadMedia(profilePhoto.path);
            const photoURL = cloudResponse.secure_url;

            await userModel.findByIdAndUpdate(_id,{$set:{name:name,photoURL:photoURL},$unset:{expiresAt:""}});

            //remove the file from 'upload' folder once it is stored in cloudinary to save space.
            fs.unlinkSync(profilePhoto.path);
        } else {
            await userModel.findByIdAndUpdate(_id,{$set:{name:name},$unset:{expiresAt:""}});
        }

        return res.status(200).json({success:true,message:'Profile Updated Successfully!',user});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}