import { useState } from "react";
import AppSidebar from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Dashboard from "@/pages/Dashboard";
import AllCourses from "@/pages/AdminCourses";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="m-2 md:ml-10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;