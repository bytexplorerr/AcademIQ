import Course from '@/components/Course';
import CourseLoading from '@/components/CourseLoading';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { useGetEnrolledCoursesQuery } from '@/app/apis/courseApi';
import { toast } from 'react-toastify';

const MyLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(searchParams.get("p")) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [courses, setCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({ type: null, value: null });
  const coursesPerPage = 8;

  const { data, error, isLoading } = useGetEnrolledCoursesQuery();

  useEffect(() => {
    if (data?.success) {
      setCourses(data?.courses);
    } else if (error) {
      toast.error(error?.data?.message || 'Error in fetching the courses. Try again!');
    }
  }, [data, error]);

  useEffect(() => {
    navigate(`?p=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  const categories = [...new Set(courses.map(course => course.category))];
  const instructors = [...new Set(courses.map(course => course.creator.name))];

  const filters = [
    { name: 'Categories', content: categories },
    { name: 'Instructor', content: instructors },
  ];

  const filteredCourses = selectedFilter.type
    ? courses.filter(course => {
        if (selectedFilter.type === 'Categories') {
          return course.category === selectedFilter.value;
        } else if (selectedFilter.type === 'Instructor') {
          return course.creator.name === selectedFilter.value;
        }
        return true;
      })
    : courses;

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <section className='my-6'>
      <h1 className='text-2xl md:text-3xl dark:text-white font-semibold text-center'>My Learning</h1>

      {isLoading ? (
        <div className='mt-6 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 xl:mx-8'>
          {Array.from({ length: 8 }).map((_, index) => <CourseLoading key={index} />)}
        </div>
      ) : (
        <main>
          {courses.length > 0 && (
            <div className='mx-1 md:mx-8 my-8'>
              <p className='mb-1 font-medium'>Filter by</p>
              <div className='flex gap-x-1 md:gap-x-2 *:cursor-pointer max-[400px]:flex-col max-[400px]:gap-y-3'>
                {filters.map((item, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <div className='flex gap-x-1 items-end'>
                          <p>{item.name}</p><IoIosArrowDown />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 p-2 bg-white dark:bg-gray-800 border rounded-lg shadow-md z-10">
                      {item.content.map((sub, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedFilter({ type: item.name, value: sub });
                            setCurrentPage(1);
                          }}
                          className={`p-2 rounded cursor-pointer text-sm text-center 
                            ${selectedFilter.type === item.name && selectedFilter.value === sub
                              ? 'bg-[#F90070] text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#F90070]'}`}
                        >
                          {sub}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                ))}
                {selectedFilter.type && (
                  <button
                    onClick={() => {
                      setSelectedFilter({ type: null, value: null });
                      setCurrentPage(1);
                    }}
                    className='text-sm text-[#F90070] underline'
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          )}

          {filteredCourses.length > 0 ? (
            <div className='my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 xl:mx-8'>
              {currentCourses.map((course, index) => (
                <Course key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className='text-lg font-medium my-12 text-center'>
              {selectedFilter.type ? `No courses found for selected ${selectedFilter.type.toLowerCase()}.` : "You are not enrolled in any course."}
            </p>
          )}

          {filteredCourses.length > 0 && (
            <>
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        disabled={currentPage === 1}
                        className='cursor-pointer'
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationLink
                        className={`cursor-pointer px-3 py-1 rounded-lg ${currentPage === 1 ? "bg-[#F90070] text-white" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {currentPage > 3 && (
                      <PaginationItem><PaginationEllipsis /></PaginationItem>
                    )}

                    {currentPage > 1 && currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          className="cursor-pointer px-3 py-1 rounded-lg bg-[#F90070] text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage);
                          }}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {currentPage < totalPages - 2 && (
                      <PaginationItem><PaginationEllipsis /></PaginationItem>
                    )}

                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          className={`cursor-pointer px-3 py-1 rounded-lg ${currentPage === totalPages ? "bg-[#F90070] text-white" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        }}
                        disabled={currentPage === totalPages}
                        className='cursor-pointer'
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <p className='text-xs text-[#F90070] text-center mt-1 mb-4'>
                {((currentPage - 1) * coursesPerPage) + 1}-{Math.min(filteredCourses.length, currentPage * coursesPerPage)} of {filteredCourses.length} courses
              </p>
            </>
          )}
        </main>
      )}
    </section>
  );
};

export default MyLearning;
