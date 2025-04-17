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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";

const courses = [
  {
    field: "Development",
    areas: [
      "Web Development",
      "Data Science",
      "Mobile Development",
      "Programming Languages",
      "Game Development",
      "Database Design & Development",
      "Software Testing",
      "No-code Development",
    ],
  },
  {
    field: "Business",
    areas: [
      "Entrepreneurship",
      "Communication",
      "Management",
      "Sales",
      "Business Strategy",
      "Operations",
      "Business Law",
      "Project Management",
    ],
  },
  {
    field: "Finance & Accounting",
    areas: [
      "Economics",
      "Finance",
      "Compliance",
      "Cryptography & Blockchain",
      "Taxes",
    ],
  },
  {
    field: "IT & Software",
    areas: [
      "Hardware",
      "IT Certifications",
      "Network & Security",
      "Operating Systems & Servers",
    ],
  },
  {
    field: "Office Productivity",
    areas: ["Microsoft", "Google", "SAP", "Oracle"],
  },
  {
    field: "Marketing",
    areas: [
      "Digital Marketing",
      "Branding",
      "Search Engine Optimization",
      "Social Media Marketing",
      "Marketing Fundamentals",
      "Public Relations",
    ],
  },
];

const ExploreSidebar = ({ query, setSelectedCategories, setSortByPrice }) => {

  const handleCategoryChange = (area) => {
    setSelectedCategories((prev) =>
      prev.includes(area)
        ? prev.filter((cat) => cat !== area)
        : [...prev, area]
    );
  };

  return (
    <Sidebar className="mt-17">
      <SidebarRail />
      <section className="p-4 space-y-4 overflow-y-auto mb-20">
        <section className="p-4 space-y-4">
          <p className="text-sm mb-4">
            Showing result for <span className="font-medium">"{query}"</span>
          </p>
          <div>
            <Label className="my-1">Filter Options</Label>
            <Select onValueChange={(value) => setSortByPrice(value)}>
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="*:cursor-pointer">
                  <SelectLabel className="font-medium">
                    Sort by Price
                  </SelectLabel>
                  <SelectItem value="low">Low to High</SelectItem>
                  <SelectItem value="high">High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Separator className="my-6" />
          <div>
            <Label className="mb-4">Category</Label>
            {courses.map((course) =>
              course.areas.map((area, idx) => (
                <div className="flex items-center space-x-2 my-3">
                  <Checkbox className='cursor-pointer' onCheckedChange={() => handleCategoryChange(area)} />
                  <Label>{area}</Label>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </Sidebar>
  );
};
export default ExploreSidebar;
