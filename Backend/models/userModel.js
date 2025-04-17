import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,'Name should be at least 3 charcaters long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,'Email address should be at least 5 characters long'],
    },
    password:{
        type:String,
        required:function(){
            return !this.googleId;
        },
        select:false,
        minLength:[6,'Password should be at least 6 charcaters long'],
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true, // Allow multiple user without googleId
    },
    role:{
        type:String,
        enum:['instructor','student'],
        default:'student',
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'course'
        }
    ],
    photoURL:{
        type:String,
    },
    verificationToken:{
        type:String,
    },
    expiresAt:{
        type:Date,
        default:()=> new Date(Date.now() + 10 * 60 * 1000),
        index:{expires:600}, // Token will expire in 10 minutes.
    },
},{timestamps:true}); // timestamps are used to keep track of user's activity like login, update etc.

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

userSchema.methods.comparePassword = async function(password){ // 'methods' keywords is used to define the method which will working on specific doucment(instance)
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function(password){ // 'statics' keyword is used to define the methods which will working on model level , not on specific document.
    return await bcrypt.hash(password,10);
}

userSchema.methods.generateChangePasswordToken = function (){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'10m'});
    return token;
}

userSchema.index({expiresAt:1},{expireAfterSeconds:600});

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel