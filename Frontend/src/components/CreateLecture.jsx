import React, { useRef } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { useCreateLectureMutation } from '@/app/apis/lectureApi';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const CreateLecture = () => {

    const titleRef = useRef(null);
    const {courseID} = useParams();

    const navigate = useNavigate();

    const [createLecture,{isLoading:createLectureLoading}] = useCreateLectureMutation();

    const handleCreateLecture = async ()=>{
        try {
            console.log(titleRef.current.value,courseID);
            const response = await createLecture({
                title:titleRef.current.value,
                courseID,
            }).unwrap();

            if(response?.success) {
                toast.success(response?.message ||  'Lecture Created Successfully!');
                titleRef.current.value = '';
            }
        } catch(err) {
            toast.error(err?.data?.message || 'Error in creating the lecture try again!');
        }
    }


  return (
    <section>
      <h1 className='font-semibold text-2xl'>Let's Add Lectures</h1>
      <p>Add some basic details for your new lecture.</p>

      <div className="my-6">
        <Label className="my-2">Title</Label>
        <Input type="text" required placeholder="Lecture Title" className="w-[250px] md:w-[500px]" ref={titleRef} />
      </div>

      <div className='flex gap-3'>
        <Button variant='outline' className='cursor-pointer' onClick={()=>navigate(`/admin/courses/edit/${courseID}`)}>Go ot Course</Button>
        <Button className='cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white' onClick={handleCreateLecture} disabled={createLectureLoading}>
          {createLectureLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>) : "Create"}
        </Button>
      </div>

    </section>
  )
}

export default CreateLecture
