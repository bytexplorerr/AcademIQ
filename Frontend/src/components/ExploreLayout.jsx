import { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Dashboard from "@/pages/Dashboard";
import { Outlet } from "react-router-dom";
import ExploreSidebar from "./ExploreSidebar";

const ExploreLayout = () => {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState('');

  return (
    <SidebarProvider defaultOpen={true}>
      <ExploreSidebar query={query} setSelectedCategories={setSelectedCategories} setSortByPrice={setSortByPrice} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="m-2 md:ml-10">
          {/* Pass setQuery to SearchPage here */}
          <Outlet context={{ setQuery, query, selectedCategories, sortByPrice }} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};


export default ExploreLayout;