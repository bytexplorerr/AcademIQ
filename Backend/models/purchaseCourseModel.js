import mongoose from "mongoose";

const purchaseCourseShecma = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true,
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','completed','failed'],
        default:'pending',
    },
    paymentID:{
        type:String,
    },
},{timestamps:true});

const purchaseCourseModel = mongoose.models.purchaseCourse || mongoose.model('purchaseCourse',purchaseCourseShecma);

export default purchaseCourseModel;