import {
  useFetchCourseProgressQuery,
  useUpdateCoureProgressMutation,
} from "@/app/apis/progressApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Loader2, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseProgress = () => {
  const { courseID } = useParams();
  const navigate = useNavigate();

  const [courseProgress, setCourseProgress] = useState({});
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  const { data, error, isLoading } = useFetchCourseProgressQuery(courseID);

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourseProgress(data?.courseProgress);
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the course progress try again!"
      );
    }
  }, [data, error]);

  const [updateCourseProgress, { isLoading: updateCourseProgressLoading }] =
    useUpdateCoureProgressMutation();

  const handleUpdateProgress = async (lectureID, index) => {
    setCurrentLectureIndex(index);

    try {
      const response = await updateCourseProgress({
        courseID,
        lectureID,
      }).unwrap();

      if (response?.success) {
        setCourseProgress(response?.courseProgress);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Error in updating the progress try again!"
      );
    }
  };

  return (
    <section>
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <main>
          <div className="flex flex-col md:flex-row justify-between my-8 mx-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {courseProgress?.courseID?.title}
            </p>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="place-self-end md:justify-between">
                    <Button
                      disabled={!courseProgress?.isCompleted}
                      onClick={() =>
                        navigate(
                          `/certificate/${courseProgress?.certificateID}`
                        )
                      }
                      className={`bg-[#F90070] hover:bg-[#F90070] text-white cursor-pointer ${courseProgress.isCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      Get Certificate
                    </Button>
                  </div>
                </TooltipTrigger>
                {!courseProgress?.isCompleted && (
                  <TooltipContent side="bottom">
                    <p>Complete all the lectures to get the certificate.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col gap-y-8 md:flex-row justify-between gap-3 mx-3">
            <Card className="w-full md:w-[72%]">
              <CardContent>
                <div className="aspect-video">
                  <ReactPlayer
                    width={"100%"}
                    height={"100%"}
                    controls
                    url={
                      courseProgress?.lectureProgress?.[currentLectureIndex]
                        ?.lectureID?.videoURL || "url"
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-medium">
                  Lecture - {currentLectureIndex + 1}{" "}
                  {
                    courseProgress?.lectureProgress?.[currentLectureIndex]
                      ?.lectureID?.title
                  }
                </p>
              </CardFooter>
            </Card>
            <Card className="w-full md:w-[25%]">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  Course Lectures
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseProgress?.lectureProgress?.map((lecture, index) => (
                  <div
                    className="cursor-pointer flex gap-3 items-center my-2 outline p-2 rounded-md"
                    key={lecture.lectureID._id}
                    onClick={() =>
                      handleUpdateProgress(lecture?.lectureID?._id, index)
                    }
                  >
                    <span>
                      {lecture?.isViewed ? (
                        <CheckCircle2 size={16} className="text-[#F90070]" />
                      ) : (
                        <PlayCircle size={16} />
                      )}
                    </span>
                    <span>{lecture?.lectureID?.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </section>
  );
};

export default CourseProgress;
