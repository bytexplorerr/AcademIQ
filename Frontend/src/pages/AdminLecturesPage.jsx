import AdminAllLectures from "@/components/AdminAllLectures";
import CreateLecture from "@/components/CreateLecture";
import React from "react";

const AdminLecturesPage = () => {
  return (
    <>
      <CreateLecture />
      <AdminAllLectures />
    </>
  );
};

export default AdminLecturesPage;
