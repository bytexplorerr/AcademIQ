import { authApi } from "./apis/authApi";
import { certificateApi } from "./apis/certificateApi";
import { courseApi } from "./apis/courseApi";
import { lectureApi } from "./apis/lectureApi";
import { progressApi } from "./apis/progressApi";
import { purchaseApi } from "./apis/purchaseApi";
import authReducer from "./slices/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [lectureApi.reducerPath]:lectureApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [progressApi.reducerPath]:progressApi.reducer,
    [certificateApi.reducerPath]:certificateApi.reducer,
    auth:authReducer,
})

export default rootReducer;