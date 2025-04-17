import dotenv from "dotenv"
dotenv.config();

import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const email = process.env.EMAIL;
const password = process.env.PASSWORD;


const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465, 
    secure:true,
    auth:{
        user:email,
        pass:password,
    }
});

// Define __dirname in ES Modules (not coming by default in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SignupMailService = async ({emailId,name,verificationToken})=>{
    try {

        const subject = 'Welcome to AcedemIQ – Verify Your Email';
        const verificationLink = `${process.env.CLIENT_URL}/signin?verificationToken=${verificationToken}`;
        
        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/SignupMailView.html"),"utf-8");

        const emailContent = emailTemplate.replace("{{username}}",name).replace("{{verificationLink}}",verificationLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailId,
            subject:subject,
            html:emailContent
        });

    } catch(err) {
        console.log(err.message);
    }
}

export const ForgotPasswordMailService = async ({name,emailId,token})=>{
    try {

        const subject = "Reset Your Password";
        const verificationLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/ForgotPasswordMailView.html"),"utf-8");
        const emailContent = emailTemplate.replace("{{username}}",name).replace("{{verificationLink}}",verificationLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailId,
            subject:subject,
            html:emailContent,
        });

    } catch(err) {
        console.log(err.message);
    }
}

export const CourseEnrolledMailView = async ({userName,emailID,courseID,title}) =>{
    try {

        const subject = 'Thank you for enrolling in a Course';
        const courseLink = `${process.env.CLIENT_URL}/course-progress/${courseID}`;

        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/CourseEnrolledMailView.html"),'utf-8');
        const emailContent = emailTemplate.replace("{{userName}}",userName).replace("{{courseTitle}}",title).replace("{{courseLink}}",courseLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailID,
            subject:subject,
            html:emailContent,
        });

    } catch(err) {
        console.log(err.message);
    }
}

export const CertificateMailService = async ({userName,emailID,title,certificateID})=>{
    try {

        const subject = 'Cheers to Your Success! Your Certificate is Ready';
        const certificateLink = `${process.env.CLIENT_URL}/certificate/${certificateID}`;

        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/CertificateMailView.html"),'utf-8');
        const emailContent = emailTemplate.replace("{{userName}}",userName).replace("{{courseTitle}}",title).replace("{{certificateLink}}",certificateLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailID,
            subject:subject,
            html:emailContent,
        });

    } catch(err) {
        console.log(err.message);
    }
}

export const GoogleOAuthMailService = async ({emailID,userName}) => {
    try {
        const subject = 'Welcome to AcedemIQ';


        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/GoogleOAuthMailView.html"),'utf-8');
        const emailContent = emailTemplate.replace("{{userName}}",userName);

        const info = transporter.sendMail({
            from:email,
            to:emailID,
            subject:subject,
            html:emailContent,
        });

    } catch(err) {
        console.log(err.message);
    }
}