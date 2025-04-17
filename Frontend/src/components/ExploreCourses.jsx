import React, { useEffect, useState } from 'react';
import CourseLoading from './CourseLoading';
import Course from './Course';
import { useLazyFetchPublishedCouresQuery } from '@/app/apis/courseApi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchCourses, { isLoading }] = useLazyFetchPublishedCouresQuery();

  const fetchMoreCourses = async () => {
    try {
      const res = await fetchCourses({ page, limit: 8 }).unwrap();
      if (res.success) {
        setCourses((prev) => [...prev, ...res.courses]);

        // Stop if fetched all
        if (courses.length + res.courses.length >= res.total) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Error fetching courses.');
    }
  };

  useEffect(() => {
    fetchMoreCourses(); // initial load
  }, []);

  return (
    <section className='my-6'>
      <h1 className='text-2xl sm:text-3xl dark:text-white font-medium text-center'>Explore Courses</h1>
      <InfiniteScroll
        dataLength={courses.length}
        next={fetchMoreCourses}
        hasMore={hasMore}
        loader={
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 xl:mx-8'>
            {Array.from({ length: 4 }).map((_, index) => <CourseLoading key={index} />)}
          </div>
        }
        endMessage={
          <p className="text-center text-gray-400 mt-4">You've seen all the courses!</p>
        }
      >
        <main className='my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 xl:mx-8'>
          {courses.map((course, index) => (
            <Course key={course._id || index} course={course} />
          ))}
        </main>
      </InfiniteScroll>
    </section>
  );
};

export default ExploreCourses;
