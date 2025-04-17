import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const progressApi = createApi({
    reducerPath:'progressApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_BASE_URL}/progress`,
        credentials:'include',
    }),
    endpoints:(builder)=>({
        fetchCourseProgress:builder.query({
            query:(courseID)=>({
                url:`/course-progress-info/${courseID}`,
                method:'GET',
            })
        }),
        updateCoureProgress:builder.mutation({
            query:({courseID,lectureID})=>({
                url:`/update/${courseID}/${lectureID}`,
                method:'PUT',
            }),
        }),
    }),
});

export const {useFetchCourseProgressQuery,useUpdateCoureProgressMutation} = progressApi;