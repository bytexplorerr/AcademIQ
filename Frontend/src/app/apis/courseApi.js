import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Courses"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/courses`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (inputData) => ({
        url: "/create",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Refetch_Creator_Courses"],
    }),
    fetchAdminCourses: builder.query({
      query: () => "/list",
      providesTags: ["Refetch_Creator_Courses"],
    }),
    updateCourse: builder.mutation({
      query: (formData) => ({
        url: "/edit-course",
        method: "PUT",
        body: formData,
      }),
    }),
    removeCourse: builder.mutation({
      query: (inputData) => ({
        url: "/remove",
        method: "DELETE",
        body: inputData,
      }),
      invalidatesTags: ["Refetch_Creator_Courses"],
    }),
    getCourseInfo: builder.query({
      query: (courseID) => ({
        url: `/course-info/${courseID}`,
        method: "GET",
      }),
    }),
    changeCourseStatus: builder.mutation({
      query: (courseID) => ({
        url: `/change-status/${courseID}`,
        method: "PATCH",
      }),
    }),
    fetchPublishedCoures:builder.query({
        query:({ page = 1, limit = 8 })=>({
            url:`/published?page=${page}&limit=${limit}`,
            method:'GET',
        }),
    }),
    getCourseDetails:builder.query({
      query:(courseID)=>({
        url:`/details/${courseID}`,
        method:'GET',
      }),
    }),
    getEnrolledCourses:builder.query({
      query:()=>({
        url:'/enrolled-courses',
        method:'GET',
      }),
    }),
    searchCourses: builder.query({
      query: ({ query, categories, sortByPrice }) => {

        let queryString = `/search?query=${encodeURIComponent(query)}`;
    
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }

        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
    
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useFetchAdminCoursesQuery,
  useUpdateCourseMutation,
  useRemoveCourseMutation,
  useGetCourseInfoQuery,
  useChangeCourseStatusMutation,
  useFetchPublishedCouresQuery,
  useLazyFetchPublishedCouresQuery,
  useGetCourseDetailsQuery,
  useGetEnrolledCoursesQuery,
  useSearchCoursesQuery,
} = courseApi;
