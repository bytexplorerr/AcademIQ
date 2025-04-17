import userModel from "../models/userModel.js";

export const createUser = async ({name,email,password,verificationToken,role})=>{

    try {
        if(!name || !email || !password || !verificationToken) {
            throw new Error('All fields are required!');
        }

        const user = await userModel.create({
            name,
            email,
            password,
            verificationToken:verificationToken,
            role
        });

        return user;

    } catch(err) {
        console.log(err.message);
    }

}