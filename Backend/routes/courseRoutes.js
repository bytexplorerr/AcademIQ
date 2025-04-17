import express from "express";
import { body } from "express-validator";
import {authUser} from "../middlewares/auhMiddleware.js";
import { ChangeCourseStatus, createCourse, EditCourse, FetchCourseInfo, FetchEnrolledCoures, getAllCoursesOfAdmin, GetCourseDetails, GetPublishdedCourse, RemoveCourse, SearchCourse } from "../controllers/courseController.js";
import upload from "../utils/multer.js";

export const courseRouter = express.Router();


courseRouter.post("/create",authUser,createCourse);

courseRouter.get("/list",authUser,getAllCoursesOfAdmin);

courseRouter.put("/edit-course",authUser,upload.single('courseThumbnail'),EditCourse);

courseRouter.delete("/remove",authUser,RemoveCourse);

courseRouter.get("/course-info/:courseID",authUser,FetchCourseInfo);

courseRouter.patch("/change-status/:courseID",authUser,ChangeCourseStatus);

courseRouter.get("/published",GetPublishdedCourse);

courseRouter.get("/details/:courseID",authUser,GetCourseDetails);

courseRouter.get("/enrolled-courses",authUser,FetchEnrolledCoures);

courseRouter.get("/search",SearchCourse);