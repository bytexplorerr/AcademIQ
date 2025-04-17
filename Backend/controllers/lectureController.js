import courseModel from "../models/courseModel.js";
import lectureModel from "../models/lectureModel.js";
import courseProgressModel from "../models/courseProgressModel.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const createLecture = async (req,res) => {
    try {

        const {role} = req.user;
        const {title,courseID} = req.body;

        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const course = await courseModel.findById(courseID);

        if(!course) {
            return res.status(404).json({success:false,message:'Course Not Found!'});
        }

        const lecture = await lectureModel.create({
            title
        });

        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({success:true,message:'Lecture Created Successfully!'});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const FetchCourseAllLectures = async (req,res) => {
    try {

        const {role} = req.user;
        const {courseID} = req.params;

        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const course = await courseModel.findById(courseID).populate({path:'lectures',select:'title'});

        if(!course) {
            return res.status(404).json({success:false,message:'Course Not Found!'});
        }

        return res.status(200).json({success:true,lectures:course.lectures});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const GetLectureInfo = async (req,res) => {
    try {
        const {role} = req.user;
        const {lectureID} = req.params;

        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const lecture = await lectureModel.findById(lectureID);

        if(!lecture) {
            return res.status(404).json({success:false,message:'Lecture Not Found!'});
        }

        return res.status(200).json({success:true,lecture});
        
    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const RemoveLecture = async (req,res) => {
    try {
        const {role} = req.user;
        const {courseID,lectureID} = req.body;

        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const course = await courseModel.findById(courseID);

        if(!course) {
            return res.status(404).json({success:false,message:'Course Not Found!'});
        }

        const lecture = await lectureModel.findById(lectureID);

        if(!lecture) {
            return res.status(404).json({success:false,message:'Lecture Not Found!'});
        }

        if(lecture.videoURL) {
            await deleteMedia(lecture.publicID);
        }

        await lectureModel.findByIdAndDelete(lectureID);

        await courseModel.findByIdAndUpdate(courseID,{$pull:{lectures:lectureID}});

        await courseProgressModel.updateMany(
            { courseID },
            { $pull: { lectureProgress: { lectureID } } }
        );

        return res.status(200).json({success:true,message:'Lecture Deleted Successfully!'});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const UpLoadVideo = async (req,res) => {
    try {
        const {role} = req.user;
        
        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }
        const data = await uploadMedia(req.file.path);

        return res.status(200).json({success:true,data,message:'Video Uploded Successfully!'});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const UpdateLecture = async (req,res) => {
    try {
        const {role} = req.user;

        if(role !== 'instructor') {
            return res.status(401).json({success:false,message:'Unauthorized!'});
        }

        const lecture = req.body;

        const lec = await lectureModel.findById(lecture._id);

        if(!lec) {
            return res.status(404).json({success:false,message:'Lecture Not Found!'});
        }

        await lectureModel.findByIdAndUpdate(lecture._id,lecture);

        return res.status(200).json({success:true,message:'Lecture updated Successfully!'});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}