import React, { useRef, useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { SlArrowRight } from "react-icons/sl";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "@/app/apis/courseApi";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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
    areas: ["Economics", "Finance", "Compliance", "Cryptography & Blockchain", "Taxes"],
  },
  {
    field: "IT & Software",
    areas: ["Hardware", "IT Certifications", "Network & Security", "Operating Systems & Servers"],
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

const CreateCourse = () => {

  const navigate = useNavigate();
  const titleRef = useRef(null);
  const [category,setCategory] = useState('');

  const [createCourse,{isLoading:createCourseLoading}] = useCreateCourseMutation();
 
  const handleCreateCourse = async ()=>{
    try {
      const response = await createCourse({
        title:titleRef.current.value,
        category:category,
      }).unwrap();

      console.log(response);
      
      if(response?.success) {
        toast.success(response?.message || 'Course Created Successfully!');
        titleRef.current.value = '';
        setCategory('');
        navigate("/admin/courses");
      } else {
        toast.error(response?.message || 'Error in creating the course try again!');
      }
    } catch(err) {
      toast.error(err?.data?.message || 'Error in creating the course try again!');
    }
  }
  return (  
    <section>
      <h1>Let's Add Course</h1>
      <p>Add some basic details for your new course</p>

      <div className="my-6">
        <Label className="my-2">Title</Label>
        <Input type="text" required placeholder="Course Title" className="w-[250px] md:w-[500px]" ref={titleRef} />
      </div>

      <div className="my-6">
        <Label className="my-2">Category</Label>
        <Select onValueChange={(value)=>setCategory(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) =>
              course.areas.map((area, idx) => (
                <SelectItem key={idx} value={area} className='cursor-pointer'>
                  <span className="hover:text-[#F90070]">{area}</span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-3'>
        <Button variant='outline' className='cursor-pointer' onClick={()=>navigate('/admin/courses')}>Back</Button>
        <Button className='cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white' onClick={handleCreateCourse} disabled={createCourseLoading}>
          {createCourseLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>) : "Create"}
        </Button>
      </div>

    </section>
  );
};

export default CreateCourse;
