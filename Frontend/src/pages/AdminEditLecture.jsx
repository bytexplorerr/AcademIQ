import {
  useFetchLectureInfoQuery,
  useRemoveLectureMutation,
  useUpdateLectureMutation,
} from "@/app/apis/lectureApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import ReactPlayer from "react-player";
import { Progress } from "@/components/ui/progress";

const AdminEditLecture = () => {
  const { courseID, lectureID } = useParams();
  const [lecture, setLecture] = useState({});
  const [mediaProgress,setMediaProgress] = useState(false);
  const [uploadProgress,setUploadProgress] = useState(0);

  const handleVideoChange = async (e) => {

    const file = e.target.files[0];

    if(!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('videoFile',file);

      setMediaProgress(true);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/lectures/upload-video`,formData,{
        withCredentials:true,
        onUploadProgress:({loaded,total})=>{
          setUploadProgress(Math.round((loaded * 100)/total));
        }
    });

    if(response?.data?.success) {
      setLecture({...lecture,videoURL:response?.data?.data?.secure_url,publicID:response?.data?.data?.public_id});
      toast.success(response?.data?.message || 'Video Uploaded Successfully!');
    }

    } catch(err) {
      toast.error(err?.response?.data?.message || 'Error in uploading the lecture try again!');
    } finally {
      setMediaProgress(false);
    }
  }

  const naviagte = useNavigate();

  const { data, error, isLoading:lectureLoading,refetch } = useFetchLectureInfoQuery(lectureID);

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setLecture(data?.lecture);
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the lecture details try again!"
      );
    }
  }, [data, error]);

  const [removeLecture, { isLoading: removeLectureLoading }] =
    useRemoveLectureMutation();

  const handleDeleteLecture = async () => {
    try {
      const response = await removeLecture({
        courseID,
        lectureID,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Lecture Removed Successfully!");
        naviagte(`/admin/courses/edit/${courseID}/lectures`);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Error in removing the course try again!"
      );
    }
  };

  const [updateLecture,{isLoading:updateLectureLoading}] = useUpdateLectureMutation();

  const handleUpdateLecture = async ()=> {
    try {

      const response = await updateLecture(lecture).unwrap();

      if(response?.success) {
        toast.success(response?.message || 'Lecture Upadted Successfully!');
        refetch();
      }
    } catch(err) {
      toast.error(err?.data?.message || 'Error in updating the lecture try again!');
    }
  }

  return (
    <section>
      {lectureLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <main>
          <div className="flex gap-3 items-center my-6">
            <Button
              variant="ghost"
              className="cursor-pointer rounded-2xl"
              onClick={() =>
                naviagte(`/admin/courses/edit/${courseID}/lectures`)
              }
            >
              <FaArrowLeft size={24} />
            </Button>
            <p className="text-2xl font-semibold">Update Lecture</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Lecture</CardTitle>
              <CardDescription>
                Edit your lecture and click on update when done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-8">
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={handleDeleteLecture}
                  disabled={removeLectureLoading || updateLectureLoading || mediaProgress}
                >
                  {removeLectureLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-1" /> Please Wait</>) : 'Remove Lecture'}
                </Button>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  type="text"
                  placeholder="Lecture Title"
                  value={lecture?.title}
                  onChange={(e) =>
                    setLecture({ ...lecture, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className='after:content-["*"] after:text-red-500'>
                  Video
                </Label>
                <Input
                  className="w-fit cursor-pointer"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  disabled={mediaProgress || removeLectureLoading || updateLectureLoading}
                />
              </div>

              {mediaProgress && <div className="my-4 flex items-center gap-1"><Progress value={uploadProgress} /><span className="text-xs">{uploadProgress}% uploaded</span></div>}

              {lecture?.videoURL && <ReactPlayer width={"500px"} height={"300px"} controls url={lecture?.videoURL} />}

              <div className="flex items-center space-x-2">
                <Switch checked={lecture?.isPreviewFree} onCheckedChange={(checked)=> setLecture({...lecture,isPreviewFree:checked})} className='cursor-pointer' />
                <Label>Is this video FREE?</Label>
              </div>

              <div>
                <Button className='bg-[#F90070] hover:bg-[#F90070] text-white cursor-pointer mt-6' onClick={handleUpdateLecture} disabled={removeLectureLoading || updateLectureLoading || mediaProgress}>
                  {updateLectureLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-1" /> Please Wait</>) : 'Update Lecture'}</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </section>
  );
};

export default AdminEditLecture;
