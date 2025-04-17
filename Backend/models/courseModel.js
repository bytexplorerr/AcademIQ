import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    subTitle:{
        type:String,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        enum:['Beginner','Intermediate','Advance'],
    },
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }],
    lectures:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'lecture',
    }],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    isPublished:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

const courseModel = mongoose.models.course || mongoose.model('course',courseSchema);

export default courseModel;
