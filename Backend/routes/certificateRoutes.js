import express from "express";
import certificateModel from "../models/certificateModel.js";

const certificateRouter = express.Router();

certificateRouter.get("/fetch/:certificateID",async (req,res)=>{
    try {

        const {certificateID} = req.params;

        let certificate = await certificateModel.findById(certificateID).populate({path:'courseID',select:'title creator',populate:{path:'creator',select:'name'}}).populate({path:'userID',select:'name'});

        if(!certificate) {
            return res.status(404).json({success:false,message:'Certificate Not Found'});
        }

        certificate = {...certificate.toObject(),certificate_url:`${process.env.CLIENT_URL}/${certificate._id}`};

        return res.status(200).json({success:true,certificate});

    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
});

export default certificateRouter;