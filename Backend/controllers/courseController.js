import { validationResult } from "express-validator";
import courseModel from "../models/courseModel.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import courseProgressModel from "../models/courseProgressModel.js";
import purchaseCourseModel from "../models/purchaseCourseModel.js";
import certificateModel from "../models/certificateModel.js";
import lectureModel from "../models/lectureModel.js";

export const createCourse = async (req, res) => {
  try {
    const { role, _id } = req.user;

    if (role !== "instructor") {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const { title, category } = req.body;

    const course = await courseModel.create({
      title,
      category,
      creator: _id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Course Created Successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const getAllCoursesOfAdmin = async (req, res) => {
  try {
    const { role, _id } = req.user;

    if (role !== "instructor") {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const courses = await courseModel.find({ creator: _id });

    return res.status(200).json({ success: true, courses });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const EditCourse = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const { id, title, subTitle, description, category, level, price } =
      req.body;
    let courseThumbnail = req.file;

    let course = await courseModel.findById(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    if (courseThumbnail) {
      if (course.thumbnail) {
        const publicID = course.thumbnail.split("/").pop().split(".")[0];
        await deleteMedia(publicID);
      }
      courseThumbnail = await uploadMedia(courseThumbnail.path);
    }

    const isValid = (val) =>
      val !== undefined && val !== "undefined" && val !== "";

    let updatedData = {
      ...(isValid(title) && { title }),
      ...(isValid(subTitle) && { subTitle }),
      ...(isValid(description) && { description }),
      ...(isValid(category) && { category }),
      ...(isValid(level) && { level }),
      ...(price !== undefined && !isNaN(price) && { price: Number(price) }),
      ...(courseThumbnail?.secure_url && {
        thumbnail: courseThumbnail.secure_url,
      }),
    };

    course = await courseModel.findByIdAndUpdate(id, updatedData);

    return res
      .status(200)
      .json({ success: true, message: "Course updated successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const RemoveCourse = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const { id } = req.body;

    const course = await courseModel.findById(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    if (course.lectures && course.lectures.length > 0) {
      for (const lectureId of course.lectures) {
        const lecture = await lectureModel.findById(lectureId);

        if (lecture) {
          // Delete video from cloudinary if it exists
          if (lecture.videoURL && lecture.publicID) {
            await deleteMedia(lecture.publicID);
          }
          // Delete lecture from DB
          await lectureModel.findByIdAndDelete(lectureId);
        }
      }
    }

    if (course.thumbnail) {
      const publicID = course.thumbnail.split("/").pop().split(".")[0];
      await deleteMedia(publicID);
    }

    await courseProgressModel.deleteMany({courseID:course._id});

    await purchaseCourseModel.deleteMany({courseID:course._id});

    await certificateModel.deleteMany({courseID:course._id});

    await courseModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Course Deleted Successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const FetchCourseInfo = async (req, res) => {
  try {
    const { role } = req.user;
    const { courseID } = req.params;

    if (role !== "instructor") {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const course = await courseModel.findById(courseID);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found!" });
    }

    return res.status(200).json({ success: true, course });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};


export const ChangeCourseStatus = async (req,res) => {
  try {

    const {role} = req.user;
    const {courseID} = req.params;

    if(role !== 'instructor') {
      return res.status(401).json({success:false,message:"Unauthorized!"});
    }

    const course = await courseModel.findById(courseID).populate({path:'lectures',select:'videoURL'});

    if(course.isPublished) {
      course.isPublished = false;
      await course.save();
      return res.status(200).json({success:true,message:'Course Unpublished Successfully!'});
    }

    if(!course) {
      return res.status(404).json({success:false,message:'Course Not Found!'});
    }

    if(!course.lectures || course.lectures.length === 0) {
      return res.status(400).json({success:false,message:'The course should have at least 1 lecture to publish it.'});
    }

    const hasVideo = course.lectures.some(lec => lec.videoURL);

    if (!hasVideo) {
      return res.status(400).json({ success: false, message: 'Course should have at least 1 video in lectures to publish it.' });
    }

    course.isPublished = true;
    await course.save();

    return res.status(200).json({success:true,message:'Course Published Successfully!'});

  } catch(err) {
    return res.status(500).json({success:false,message:"Internal server error!"});
  }
}

export const GetPublishdedCourse = async (req,res) => {
  try {
    const { page = 1, limit = 8 } = req.query;

    const skip = (page - 1) * limit;

    const courses = await courseModel.find({ isPublished: true })
      .skip(parseInt(skip))
      .limit(parseInt(limit)).populate({path:'creator',select:'name photoURL'});

    const total = await courseModel.countDocuments({ isPublished: true });

    return res.status(200).json({
      success: true,
      courses,
      total,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const GetCourseDetails = async (req,res) => {
  try {

    const {courseID} = req.params;

    const course = await courseModel.findById(courseID).populate({path:'creator',select:'name'}).populate({path:'lectures',select:'title videoURL isPreviewFree'});

    if(!course) {
      return res.status(404).json({success:false,message:'Course Not Found!'});
    }

    const updatedLecturesInfo = course.lectures.map((lecture)=>({
      _id:lecture._id,
      title:lecture.title,
      isPreviewFree:lecture.isPreviewFree,
      videoURL: lecture.isPreviewFree ? lecture.videoURL : null,
    }));

    return res.status(200).json({success:true,course:{...course.toObject(),lectures:updatedLecturesInfo}});

  } catch(err) {
    return res.status(500).json({success:false,message:'Internal server error!'});
  }
}

export const FetchEnrolledCoures = async (req,res) => {
  try {

    const {_id} = req.user;
    
    const courses = await courseModel.find({enrolledStudents:_id}).populate({path:'creator',select:'name photoURL'});

    return res.status(200).json({success:true,courses});

  } catch(err) {
    return res.status(500).json({success:false,message:'Internal server error!'});
  }
}

export const SearchCourse = async (req, res) => {
  try {
     
     const { query = "", categories = "", sortByPrice = "low" } = req.query;

     // Convert categories from a string to an array
     let categoryArray = [];
     if (categories) {
        categoryArray = categories.split(',').map(cat => cat.trim()); // Split by comma and trim spaces
     }
     
     // Build the search criteria
     const searchCriteria = {
        isPublished: true,
        $or: [
           { title: { $regex: query, $options: "i" } },
           { subTitle: { $regex: query, $options: "i" } },
           { category: { $regex: query, $options: "i" } },
        ]
     };

     // Add category filter if categories are provided
     if (categoryArray.length > 0) {
        searchCriteria.category = { $in: categoryArray };
     }

     const sortOptions = {};
     if (sortByPrice === 'low') {
        sortOptions.price = 1; // Ascending order
     } else if (sortByPrice === 'high') {
        sortOptions.price = -1; // Descending order
     }

     const courses = await courseModel
        .find(searchCriteria)
        .populate({ path: 'creator', select: 'name' })
        .sort(sortOptions);

     return res.status(200).json({ success: true, courses });

  } catch (err) {
     return res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
