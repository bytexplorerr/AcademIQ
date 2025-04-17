import React, { useEffect, useState } from 'react'
import { useFetchAllLecturesQuery } from '@/app/apis/lectureApi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Table, TableBody, TableCaption, TableCell, TableRow } from './ui/table'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

const AdminAllLectures = () => {

    const {courseID} = useParams();
    const navigate = useNavigate();

    const [lectures,setLectures] = useState([]);

    const {data,error,isLoading} = useFetchAllLecturesQuery(courseID);

    useEffect(()=>{
        if(data) {
            if(data?.success) {
                setLectures(data?.lectures);
            }
        } else if(error) {
            toast.error(error?.data?.message || 'Error in fetching the lectures try again!');
        }
    },[data,error]);

  return (
    <section>
        {isLoading ? <div className='flex justify-center my-8'><Loader2 className='w-8 h-8 animate-spin text-gray-800 dark:text-white' /></div>
        : <Table className='my-16'>
        <TableCaption>{lectures?.length === 0 ? 'No lectures available' : 'List of lectures.'}</TableCaption>
        <TableBody>
            {lectures.map((lecture,index)=>(
                <TableRow key={lecture._id}>
                    <TableCell colSpan={1}><span className='font-medium text-lg'>Lecture - {index+1}</span></TableCell>
                    <TableCell><span className='font-semibold text-xl'>{lecture?.title}</span></TableCell>
                    <TableCell colSpan={1}><Button variant='outline'  className='cursor-pointer' onClick={()=>navigate(`/admin/courses/edit/${courseID}/lectures/${lecture._id}`)}>Edit</Button></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>}
    </section>
  )
}

export default AdminAllLectures
