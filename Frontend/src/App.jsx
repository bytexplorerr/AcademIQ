import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import Login from "./pages/login";
import { toast, ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyLearning from "./pages/MyLearning";
import Profile from "./pages/Profile";
import { useGetProfileQuery } from "./app/apis/authApi";
import { useDispatch } from "react-redux";
import { loggedIn } from "./app/slices/authSlice";
import Dashboard from "./pages/Dashboard";
import AllCourses from "./pages/AdminCourses";
import AdminLayout from "./components/AdminLayout";
import CreateCourse from "./components/CreateCourse";
import AdminEditCourse from "./components/AdminEditCourse";
import AdminLecturesPage from "./pages/AdminLecturesPage";
import AdminEditLecture from "./pages/AdminEditLecture";
import CourseDetails from "./pages/CourseDetails";
import CourseProgress from "./pages/CourseProgress";
import Certificate from "./pages/Certificate";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ExploreLayout from "./components/ExploreLayout";
import SearchPage from "./pages/SearchPage";
import { AdminRoutes, AuthenticatedUser, ProtectedRoute, PurchasedCourseRoute } from "./components/ProtectedRoutes";

const App = () => {
  const { data, error, isLoading: profileLoading } = useGetProfileQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      if (data?.success) {
        dispatch(loggedIn(data.user));
      }
    }
  }, [data, error]);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthenticatedUser><Login /></AuthenticatedUser>} />
        <Route path="/signup" element={<AuthenticatedUser><Login /></AuthenticatedUser>} />
        <Route path="/forgot-password" element={<AuthenticatedUser><ForgotPassword /></AuthenticatedUser>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/course-details/:courseID" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        <Route path="/course-progress/:courseID" element={<ProtectedRoute><PurchasedCourseRoute><CourseProgress /></PurchasedCourseRoute></ProtectedRoute>} />
        <Route path="/certificate/:certificateID" element={<Certificate />} />
        <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/explore/*" element={<ExploreLayout />}>
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route path="/admin/*" element={<AdminRoutes><AdminLayout /></AdminRoutes>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/edit/:courseID" element={<AdminEditCourse />} />
          <Route path="courses/edit/:courseID/lectures" element={<AdminLecturesPage />} />
          <Route path="courses/edit/:courseID/lectures/:lectureID" element={<AdminEditLecture />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </GoogleOAuthProvider>
  );
};

export default App;