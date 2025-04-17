import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    videoURL:{
        type:String,
    },
    publicID:{
        type:String,
    },
    isPreviewFree:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

const lectureModel  = mongoose.models.lecture || mongoose.model('lecture',lectureSchema);

export default lectureModel;