import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from"@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import RichTextEditor from "./RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "react-toastify";
import {
  useChangeCourseStatusMutation,
  useGetCourseInfoQuery,
  useRemoveCourseMutation,
  useUpdateCourseMutation,
} from "@/app/apis/courseApi";
import { Loader2 } from "lucide-react";

const courses = [
  {
    field: "Development",
    areas: [
      "Web Development",
      "Data Science",
      "Mobile Development",
      "Programming Languages",
      "Game Development",
      "Database Design & Development",
      "Software Testing",
      "No-code Development",
    ],
  },
  {
    field: "Business",
    areas: [
      "Entrepreneurship",
      "Communication",
      "Management",
      "Sales",
      "Business Strategy",
      "Operations",
      "Business Law",
      "Project Management",
    ],
  },
  {
    field: "Finance & Accounting",
    areas: [
      "Economics",
      "Finance",
      "Compliance",
      "Cryptography & Blockchain",
      "Taxes",
    ],
  },
  {
    field: "IT & Software",
    areas: [
      "Hardware",
      "IT Certifications",
      "Network & Security",
      "Operating Systems & Servers",
    ],
  },
  {
    field: "Office Productivity",
    areas: ["Microsoft", "Google", "SAP", "Oracle"],
  },
  {
    field: "Marketing",
    areas: [
      "Digital Marketing",
      "Branding",
      "Search Engine Optimization",
      "Social Media Marketing",
      "Marketing Fundamentals",
      "Public Relations",
    ],
  },
];

const AdminEditCourse = () => {
  const location = useLocation();
  const [course, setCourse] = useState({});
  const [preiewThumbnail, setPreviewThubnail] = useState(
    course?.thumbnail || ""
  );

  const { courseID } = useParams();

  const {
    data,
    isLoading: courseLoading,
    error,
    refetch,
  } = useGetCourseInfoQuery(courseID);

  const navigate = useNavigate();

  const [updateCourse, { isLoading: updateCourseLoading }] =
    useUpdateCourseMutation();
  const [removeCourse, { isLoading: removeCourseLoading }] =
    useRemoveCourseMutation();

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourse(data?.course);
        setPreviewThubnail(data?.course?.thumbnail);
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the course deatils try again!"
      );
    }
  }, [data, error]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourse({ ...course, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThubnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", course?._id);
      formData.append("title", course?.title);
      formData.append("subTitle", course?.subTitle);
      formData.append("description", course?.description);
      formData.append("category", course?.category);
      formData.append("level", course?.level);
      formData.append("price", course?.price);
      formData.append("courseThumbnail", course?.thumbnail);

      const response = await updateCourse(formData).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Course Updated Successfully!");
        refetch();
        navigate("/admin/courses");
      } else {
        toast.error(
          response?.message || "Error in updating the data , try again!"
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Error in updating the data , try again!"
      );
    }
  };

  const handleRemoveCourse = async () => {
    try {
      const response = await removeCourse({
        id: course._id,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Course Deleted Successfilly!");
        navigate("/admin/courses");
      } else {
        toast.error(
          response?.message || "Error in removing the course, try again!"
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Error in removing the course, try again!"
      );
    }
  };

  const [changeCourseStatus,{isLoading:courseStatusLoading}] = useChangeCourseStatusMutation();
  
  const handleCourseStatus = async ()=> {
    try {
      const response = await changeCourseStatus(courseID).unwrap();

      if(response?.success) {
        toast.success(response?.message || `Course ${course?.isPublished ? 'Unpublished' : 'Published'} Successfully!`);
        refetch();
      }
    } catch(err) {
      toast.error(err?.data?.message || 'Error in changing the course status try again!');
    }
  }

  return (
    <section>
      {courseLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <main>
          <div className="flex max-[480px]:flex-col  gap-3 justify-between items-center my-4">
            <p className="font-semibold">
              Add detailed information regarding course
            </p>
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={removeCourseLoading || updateCourseLoading || courseStatusLoading}
              onClick={() => navigate("lectures")}
            >
              Go to Lectures Page
            </Button>
          </div>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-y-5 gap-x-3 justify-between">
                <div className="space-y-1">
                  <CardTitle>Basic Course Information</CardTitle>
                  <CardDescription>
                    Make changes to your courses here. Click save when you're
                    done.
                  </CardDescription>
                </div>
                <div className="flex gap-3 *:cursor-pointer max-[280px]:flex-col">
                  <Button variant="outline" disabled={updateCourseLoading || removeCourseLoading || courseStatusLoading} onClick={handleCourseStatus}>
                    {courseStatusLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-1" /> Please Wait</>) : course?.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant='destructive'
                    onClick={handleRemoveCourse}
                    disabled={removeCourseLoading || updateCourseLoading || courseStatusLoading}
                  >
                    {removeCourseLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Please
                        Wait{" "}
                      </>
                    ) : (
                      "Remove Courses"
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-medium">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={course?.title}
                  onChange={handleDataChange}
                />
              </div>
              <div>
                <Label className="font-medium">Subtitle</Label>
                <Input
                  type="text"
                  name="subTitle"
                  placeholder="Subtitle"
                  value={course?.subTitle}
                  onChange={handleDataChange}
                />
              </div>
              <div>
                <Label className="font-medium">Decription</Label>
                <RichTextEditor course={course} setCourse={setCourse} />
              </div>

              <div className="flex gap-4 items-center space-y-4">
                <div>
                  <Label className="font-medium">Category</Label>
                  <Select
                    value={course?.category}
                    onValueChange={(value) =>
                      setCourse({ ...course, category: value })
                    }
                  >
                    <SelectTrigger className="w-[200px] cursor-pointer">
                      <SelectValue placeholder="Select a category"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) =>
                        course.areas.map((area, idx) => (
                          <SelectItem
                            key={idx}
                            value={area}
                            className="cursor-pointer"
                          >
                            <span className="hover:text-[#F90070]">{area}</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Course Level</Label>
                  <Select
                    value={course?.level}
                    onValueChange={(value) =>
                      setCourse({ ...course, level: value })
                    }
                  >
                    <SelectTrigger className="w-[200px] cursor-pointer">
                      <SelectValue placeholder="Select a category"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">
                        <span className="hover:text-[#F90070]">Beginner</span>
                      </SelectItem>
                      <SelectItem value="Intermediate">
                        <span className="hover:text-[#F90070]">
                          Intermediate
                        </span>
                      </SelectItem>
                      <SelectItem value="Advanced">
                        <span className="hover:text-[#F90070]">Advanced</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Price in (INR)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="199"
                    className="w-[200px] cursor-pointer"
                    onChange={handleDataChange}
                    name="price"
                    value={course?.price}
                  />
                </div>
              </div>

              <div>
                <Label className="font-medium">Course Thumnail</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="w-fit cursor-pointer"
                />
                {preiewThumbnail && (
                  <img
                    src={preiewThumbnail}
                    alt="Course Thumbnail"
                    className="w-64 my-4"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 my-12">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => navigate("/admin/courses")}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white"
                  onClick={handleUpdate}
                  disabled={updateCourseLoading || removeCourseLoading || courseStatusLoading}
                >
                  {updateCourseLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Please
                      Wait{" "}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </section>
  );
};

export default AdminEditCourse;
