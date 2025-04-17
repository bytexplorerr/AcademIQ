import React from 'react'
import { Card } from './ui/card'
import UserProfile from './UserProfile'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const Course = ({course}) => {
  const navigate = useNavigate();
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg  rounded-lg transform hover:scale-105 transition-all duration-300 cursor-pointer p-0" onClick={()=>navigate(`/course-details/${course._id}`)}>
        <div>
            <img src = {course?.thumbnail || 'https://as1.ftcdn.net/v2/jpg/02/68/55/60/1000_F_268556011_PlbhKss0alfFmzNuqXdE3L0OfkHQ1rHH.jpg'}
                alt='course'
                className='w-full h-36 object-cover rounded-t-lg'
            />
            <p className='my-2 text-lg font-medium hover:underline mx-1 dark:text-white'>{course?.title}</p>
            <div className='flex justify-between items-center mx-1 my-2'>
                <div className='flex items-center gap-2 hover:underline'>
                <Avatar>
                <AvatarImage src={course?.creator?.photoURL} alt="Creator Photo" />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
                <span className='text-sm font-medium dark:text-white'>{course?.creator?.name}</span>
                </div>
                <Badge className='bg-[#F90070] mr-2 text-white'>{course?.level || 'Beginner'}</Badge>
            </div>
            <p className='mx-4 my-1 mb-3 font-bold dark:text-white'>₹{course?.price || 0}</p>
        </div>
    </Card>
  )
}

export default Course