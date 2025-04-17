import courseProgressModel from "../models/courseProgressModel.js";
import certificateModel from "../models/certificateModel.js";
import { CertificateMailService } from "../services/mailService.js";

export const GetCourseProgress = async (req,res) => {
    try {
        const {_id} = req.user;
        const {courseID} = req.params;

        const courseProgress = await courseProgressModel.findOne({userID:_id,courseID}).populate('lectureProgress.lectureID').populate({path:'courseID',select:'title'});

        return res.status(200).json({success:true,courseProgress});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const UpdateCourseProgress = async (req,res) => {
    try {

        const {_id} = req.user;
        const {courseID,lectureID} = req.params;

        const courseProgress = await courseProgressModel.findOne({userID:_id,courseID}).populate('lectureProgress.lectureID').populate({path:'courseID',select:'title'}).populate({path:'userID',select:'name email'});

        if(!courseProgress) {
            return res.status(404).json({success:false,message:'Course Progress Not Found!'});
        }

        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture)=> lecture.lectureID._id.toString() === lectureID);

        if(lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].isViewed = true;
        }


        const allViewed = courseProgress.lectureProgress.every(
            (lecture) => lecture.isViewed === true
        );

        let certificate;

        if (allViewed && !courseProgress.isCompleted) {
            courseProgress.isCompleted = true;
            certificate = await certificateModel.create({
                courseID,
                userID:_id,
            });
            courseProgress.certificateID = certificate._id;

            await CertificateMailService({
                userName:courseProgress.userID.name,
                emailID:courseProgress.userID.email,
                title:courseProgress.courseID.title,
                certificateID:courseProgress.certificateID,
            });
        }

        await courseProgress.save();

        return res.status(200).json({success:true,courseProgress});
    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
} 