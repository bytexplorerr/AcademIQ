import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lectureApi = createApi({
  reducerPath: "lectureApi",
  tagTypes: ["REFETCH_LECTURES"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/lectures`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createLecture: builder.mutation({
      query: (inputData) => ({
        url: "/create",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["REFETCH_LECTURES"],
    }),
    fetchAllLectures: builder.query({
      query: (courseID) => ({
        url: `/list/${courseID}`,
        method: "GET",
      }),
      providesTags: ["REFETCH_LECTURES"],
    }),
    fetchLectureInfo: builder.query({
      query: (lectureID) => ({
        url: `/lecture-info/${lectureID}`,
        method: "GET",
      }),
    }),
    removeLecture: builder.mutation({
      query: (inputData) => ({
        url: "/remove",
        body: inputData,
        method: "DELETE",
      }),
      invalidatesTags: ["REFETCH_LECTURES"],
    }),
    updateLecture: builder.mutation({
      query: (inputData) => ({
        url: "edit-lecture",
        method: "PUT",
        body: inputData,
      }),
    }),
  }),
});

export const {
  useCreateLectureMutation,
  useFetchAllLecturesQuery,
  useFetchLectureInfoQuery,
  useRemoveLectureMutation,
  useUpdateLectureMutation,
} = lectureApi;
