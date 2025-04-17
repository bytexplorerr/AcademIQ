import express from "express";
import { authUser } from "../middlewares/auhMiddleware.js";
import { GetCourseProgress, UpdateCourseProgress } from "../controllers/courseProgressController.js";

const courseProgressRouter = express.Router();

courseProgressRouter.get("/course-progress-info/:courseID",authUser,GetCourseProgress);
courseProgressRouter.put("/update/:courseID/:lectureID",authUser,UpdateCourseProgress);

export default courseProgressRouter;