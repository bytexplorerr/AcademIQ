import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const purchaseApi = createApi({
    reducerPath:'purchaseApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_BASE_URL}/purchase`,
        credentials:'include',
    }),
    endpoints:(builder)=>({
        createCheckoutSession:builder.mutation({
            query:(inputData)=>({
                url:'/checkout/create-checkout-session',
                method:'POST',
                body:inputData,
            }),
        }),
        getPurchasedCourses:builder.query({
            query:()=>({
                url:'/sales-info',
                method:'GET',
            }),
        }),
        getPurchaseStatus:builder.query({
            query:(courseID)=> ({
                url:`/status/${courseID}`,
                method:'GET',
            }),
        }),
    }),
});

export const {useCreateCheckoutSessionMutation,useGetPurchasedCoursesQuery,useGetPurchaseStatusQuery} = purchaseApi;