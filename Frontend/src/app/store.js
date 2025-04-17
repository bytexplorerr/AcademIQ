import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "./apis/authApi";
import { courseApi } from "./apis/courseApi";
import { lectureApi } from "./apis/lectureApi";
import { purchaseApi } from "./apis/purchaseApi";
import { progressApi } from "./apis/progressApi";
import { certificateApi } from "./apis/certificateApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (deafultMiddleware) =>
    deafultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      lectureApi.middleware,
      purchaseApi.middleware,
      progressApi.middleware,
      certificateApi.middleware
    ),
});
