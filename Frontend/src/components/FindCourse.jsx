import React, { useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const FindCourse = () => {
  const navigate = useNavigate();
  const queryRef = useRef('');
  return (
    <section className='bg-gradient-to-r from-pink-500 to-pink-600 dark:from-gray-800 dark:to-gray-900 py-14 flex justify-center'>
        <div className='text-white text-center'>  
            <h1 className='font-semibold text-2xl md:text-3xl mx-2'>Find the Best Courses for You</h1>
            <p className='text-xs'>Discover, Learn, and Upskill with our wide range of courses</p>
            <div className='flex my-6'>
            <Input type='text' placeholder='Search Courses' required ref={queryRef}
                className='placeholder-black dark:placeholder-white bg-white rounded-full rounded-r-none text-black dark:text-white py-2 px-3 outline-0 border-0 focus-visible:ring-0 shadow-lg' />
            <Button className='bg-pink-600 rounded-r-full hover:bg-pink-700 cursor-pointer text-white shadow-lg' onClick={()=>navigate("/explore/search",{state:{query:queryRef.current.value}})}>Search</Button>
            </div>
            <Button className='bg-pink-600 rounded-lg hover:bg-pink-700 text-white cursor-pointer shadow-lg border-1 border-white' onClick={()=>navigate("/explore/search",{state:{query:''}})}>Explore Courses</Button>
        </div>
    </section>
  )
}

export default FindCourse