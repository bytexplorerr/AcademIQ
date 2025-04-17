import React, { useState } from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartNoAxesColumn,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareLibrary,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const AppSidebar = (props) => {
  const {setOpen,setOpenMobile} = useSidebar();
  const [activeNav,setActiveNav] = useState('Dashboard');
  return (
    <Sidebar {...props} className="mt-17">
      <SidebarRail />
      <nav className="mt-8 p-2 space-y-4">
          <Link to='/admin/dashboard' className={`flex gap-2 items-center ${activeNav === 'Dashboard' ? 'text-[#F90070]' : 'text-black dark:text-white'}`} title='Dashboard' onClick={()=>{setActiveNav('Dashboard');setOpen(false);setOpenMobile(false)}}>
            <ChartNoAxesColumn size={24} />
            <span>Dashboard</span>
          </Link>
          <Link to='/admin/courses' className={`flex gap-2 items-center ${activeNav === 'Courses' ? 'text-[#F90070]' : 'text-black dark:text-white'}`} title='Courses' onClick={()=>{setActiveNav('Courses');setOpen(false);setOpenMobile(false)}}>
            <SquareLibrary size={24} />
            <span>Courses</span>
          </Link>
      </nav>
    </Sidebar>
  );
};
export default AppSidebar;