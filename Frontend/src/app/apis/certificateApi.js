import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const certificateApi = createApi({
    reducerPath:'certificateApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_BASE_URL}/certificate`,
        credentials:'include',
    }),
    endpoints:(builder)=>({
        fetchCertificate:builder.query({
            query:(certificateID)=>({
                url:`fetch/${certificateID}`,
                method:'GET',
            })
        })
    })
})

export const {useFetchCertificateQuery} =  certificateApi;