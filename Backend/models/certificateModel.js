import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true,
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }
},{timestamps:true});

const certificateModel = mongoose.models.certificate || mongoose.model('certificate',certificateSchema);

export default certificateModel;