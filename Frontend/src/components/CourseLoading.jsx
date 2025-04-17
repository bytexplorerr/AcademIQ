import React from 'react'
import { Skeleton } from './ui/skeleton'

const CourseLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg">
      <Skeleton className="h-36 w-full" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-[95%]" />
        <div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-x-2 items-center'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-4 w-40' />
                </div>
                <Skeleton className='h-4 w-18' />
            </div>
        </div>
        <Skeleton className='h-4 w-18' />
      </div>
    </div>
  )
}

export default CourseLoading