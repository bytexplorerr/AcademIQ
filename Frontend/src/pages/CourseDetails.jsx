import { useGetCourseDetailsQuery } from "@/app/apis/courseApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import PurchaseCourse from "@/components/PurchaseCourse";

const CourseDetails = () => {
  const { courseID } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [course, setCourse] = useState({});
  const [previewLecture, setPreviewLecture] = useState({});

  const { data, isLoading, error } = useGetCourseDetailsQuery(courseID);

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourse(data?.course);
        for (const lecture of data?.course?.lectures) {
          if (lecture.isPreviewFree && lecture.videoURL) {
            setPreviewLecture(lecture);
            break;
          }
        }
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the course details try again!"
      );
    }
  }, [data, error]);

  return (
    <section>
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <main>
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-8 space-y-1 mb-8">
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {course?.title}
            </p>
            <p className="text-md">{course?.subTitle}</p>
            <p className="text-md">
              Create By{" "}
              <span className="italic underline font-medium">
                {course?.creator?.name}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <BadgeInfo size={16} /> Last updated{" "}
              <span className="font-medium">
                {new Date(course?.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p>
              Student Enrolled :{" "}
              <span className="font-medium">
                {course?.enrolledStudents?.length}
              </span>
            </p>
          </div>

          <section className="flex flex-col md:flex-row gap-y-8 justify-between gap-3">
            <div className="mx-4 w-full md:w-[55%]">
              <div className="mt-4 mb-8">
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                  Description
                </p>
                <p className="mt-2">{course?.description}</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Course Content</CardTitle>
                  <CardDescription>{course?.lectures?.length} lectures</CardDescription>
                </CardHeader>
                <CardContent>
                  {course?.lectures?.map((lecture) => (
                    <div className="flex items-center gap-2 my-3">
                      {lecture.isPreviewFree ? (
                        <PlayCircle size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                      <span>{lecture.title}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card className="mx-4 w-full md:w-[40%]">
              <CardContent className="space-y-2">
                <div className="aspect-video">
                  <ReactPlayer
                    width={"100%"}
                    height={"100%"}
                    controls
                    url={previewLecture?.videoURL || "url"}
                  />
                </div>
                <p className="font-medium text-lg my-3">
                  {previewLecture?.title || "Purchase the Course"}
                </p>
                <Separator className="my-3" />
                <p className="font-bold">₹ {course?.price || 0}</p>

                {course?.enrolledStudents?.includes(user?._id) ? (
                  <Button className="bg-[#F90070] hover:bg-[#F90070] text-white my-4 cursor-pointer" onClick={()=>navigate(`/course-progress/${courseID}`)}>
                    Continue
                  </Button>
                ) : (
                  <PurchaseCourse courseID={courseID} />
                )}

              </CardContent>
            </Card>
          </section>
        </main>
      )}
    </section>
  );
};

export default CourseDetails;
