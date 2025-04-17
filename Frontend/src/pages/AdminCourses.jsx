import { useFetchAdminCoursesQuery } from "@/app/apis/courseApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const {
    data,
    error,
    isLoading: coursesLoading,
  } = useFetchAdminCoursesQuery();

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourses([...data.courses].reverse());
      }
    } else if (error) {
      toast.error(error?.data?.message || "Error in fetching the course, try again!");
    }
  }, [data, error]);

  return (
    <section>
      <Button
        onClick={() => navigate("/admin/courses/create")}
        className="cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white"
      >
        Create a new Course
      </Button>
      <Table className="my-10">
        <TableCaption>List of courses.</TableCaption>
        <TableHeader className="text-lg">
          <TableRow>
            <TableHead className="w-[100px]" colSpan={4}>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coursesLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
              </TableCell>
            </TableRow>
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium" colSpan={4}>{course.title}</TableCell>
                <TableCell>{course?.price ? `${course?.price} ₹` : 'NA'}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      course.isPublished ? "bg-green-500" : "bg-red-500"
                    } text-white p-2 rounded-lg capitalize`}
                  >
                    {course.isPublished ? "Published" : "Unpublished"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" className="cursor-pointer" onClick={()=>navigate(`edit/${course._id}`)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                You don't have any courses.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default AllCourses;