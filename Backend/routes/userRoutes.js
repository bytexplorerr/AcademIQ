import express from "express"
import {body} from "express-validator"
import {Register,VerifyPasswordResetToken,ForgotPassword,GetProfile,Logout,verifyUser,ResetPassword,Signin, EditProfile} from "../controllers/userController.js";
import {authUser} from "../middlewares/auhMiddleware.js";
import upload from "../utils/multer.js";

export const userRouter = express.Router();

userRouter.post("/register",[
    body('name').isLength({min:3}).withMessage('Name should be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 chracters long')
],Register);

userRouter.post("/signin",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 characters long!'),
],Signin);


userRouter.post("/forgot-password",[
    body('email').isEmail().withMessage('Invalid Email')
],ForgotPassword);

userRouter.get("/verify-reset-token/:token",VerifyPasswordResetToken);

userRouter.post("/reset-password",[
    body('newPassword').isLength({min:6}).withMessage('Password should be at least 6 charcaters long'),
],ResetPassword);

userRouter.get("/profile",authUser,GetProfile);

userRouter.post("/logout",authUser,Logout);

userRouter.get("/verify-user/:token",verifyUser);

userRouter.put("/edit-profile",authUser,upload.single('profilePhoto'),EditProfile);