import { useSearchCoursesQuery } from "@/app/apis/courseApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const SearchPage = () => {
  const location = useLocation();
  const { setQuery, query, selectedCategories, sortByPrice } =
    useOutletContext();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (location?.state?.query) {
      setQuery(location?.state?.query);
    }
  }, [location]);

  const { data, error, isLoading } = useSearchCoursesQuery({
    query,
    categories: selectedCategories,
    sortByPrice,
  });

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourses(data?.courses);
      }
    } else if (error) {
      toast.error(
        error?.data?.message || "Error in fetching courses try again!"
      );
    }
  }, [data, error]);

  return (
    <section className="space-y-6">
      {isLoading ? (
        <div>
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : (
        <main className='space-y-6'>
          {courses.map((course) => (
            <Card key={course._id}>
              <CardContent className="flex flex-col items-center sm:flex-row gap-4">
                <div>
                  <img
                    src={course?.thumbnail || 'https://as1.ftcdn.net/v2/jpg/02/68/55/60/1000_F_268556011_PlbhKss0alfFmzNuqXdE3L0OfkHQ1rHH.jpg'}
                    alt={course?.title}
                    className="rounded-sm w-full sm:w-[350px] h-[150px]"
                  />
                </div>
                <div className="flex justify-between gap-1 w-full">
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">{course?.title}</p>
                    <p>{course?.subTitle}</p>
                    <p className="text-sm">
                      Instructor{" "}
                      <span className="font-medium">
                        {course?.creator?.name}
                      </span>
                    </p>
                    <Badge className="bg-[#F90070] capitalize">
                      {course?.level || 'Beginner'}
                    </Badge>
                  </div>
                  <p className="font-semibold place-self-center">
                    ₹ {course?.price || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      )}
    </section>
  );
};

const CourseSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center sm:items-start sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-[250px]">
          <Skeleton className="rounded-sm h-32 w-full" />
        </div>
        <div className="flex justify-between gap-1 w-full">
          <div className="space-y-3 w-full">
            <Skeleton className="h-8 w-full sm:w-4/5 lg:w-[600px]" />
            <Skeleton className="h-6 w-3/4 sm:w-3/5 lg:w-[500px]" />
            <Skeleton className="h-4 w-1/2 sm:w-1/4 lg:w-[200px]" />
            <Skeleton className="h-4 w-1/3 sm:w-1/5 lg:w-[100px]" />
          </div>
          <div className="w-[100px] self-center hidden sm:block">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPage;
