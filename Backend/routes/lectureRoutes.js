import express from "express"
import { authUser } from "../middlewares/auhMiddleware.js";
import { createLecture, FetchCourseAllLectures, GetLectureInfo, RemoveLecture, UpdateLecture, UpLoadVideo } from "../controllers/lectureController.js";
import upload from "../utils/multer.js";

const lectureRouter = express.Router();

lectureRouter.post("/create",authUser,createLecture);
lectureRouter.get("/list/:courseID",authUser,FetchCourseAllLectures);
lectureRouter.get("/lecture-info/:lectureID",authUser,GetLectureInfo);
lectureRouter.delete("/remove",authUser,RemoveLecture);
lectureRouter.post("/upload-video",authUser,upload.single('videoFile'),UpLoadVideo);
lectureRouter.put("/edit-lecture",authUser,UpdateLecture);

export default lectureRouter;