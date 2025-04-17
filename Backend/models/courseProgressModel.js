import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'lecture',
        required:true,
    },
    isViewed:{
        type:Boolean,
        default:false,
    }
});

const courseProgressSchema = new mongoose.Schema({
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
    lectureProgress:[lectureProgressSchema],
    isCompleted:{
        type:Boolean,
        default:false,
    },
    certificateID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'certificate',
        default:null,
    }
},{timestamps:true});

const courseProgressModel = mongoose.models.courseProgress || mongoose.model('courseProgress',courseProgressSchema);

export default courseProgressModel;