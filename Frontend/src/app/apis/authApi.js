import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/users`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // for fetching data from API use 'query' else use 'mutation' for post the data to API.
    register: builder.mutation({
      query: (inputData) => ({
        url: "/register",
        method: "POST",
        body: inputData,
      }),
    }),
    login: builder.mutation({
      query: (inputData) => ({
        url: "/signin",
        method: "POST",
        body: inputData,
      }),
    }),
    verifyUser: builder.query({
      query: (token) => `/verify-user/${token}`,
    }),
    forgotPassword: builder.mutation({
      query: (inputData) => ({
        url: "/forgot-password",
        method: "POST",
        body: inputData,
      }),
    }),
    verifyPasswordResetToken: builder.query({
      query: (token) => `/verify-reset-token/${token}`,
    }),
    resetPassword: builder.mutation({
      query: (inputData) => ({
        url: "/reset-password",
        method: "POST",
        body: inputData,
      }),
    }),
    getProfile:builder.query({
      query:()=> '/profile' 
    }),
    logout: builder.mutation({
      query:()=>({
        url:"/logout",
        method:"POST",
      }),
    }),
    editProfile:builder.mutation({
      query:(formData)=>({
        url:"/edit-profile",
        method:"PUT",
        body:formData,
      })
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyUserQuery,
  useForgotPasswordMutation,
  useVerifyPasswordResetTokenQuery,
  useResetPasswordMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useEditProfileMutation
} = authApi;