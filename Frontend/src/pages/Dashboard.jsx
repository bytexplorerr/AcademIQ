import { useGetPurchasedCoursesQuery } from "@/app/apis/purchaseApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [courseData, setCourseData] = useState({});
  const { data, error, isLoading } = useGetPurchasedCoursesQuery();

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setCourseData(data?.courseData);
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in fetching the sales information try again!"
      );
    }
  }, [data, error]);

  return (
    <section>
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-800 dark:text-white" />
        </div>
      ) : (
        <main className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6  *:w-full sm:*:w-[200px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-[#F90070] text-2xl">
                  {courseData?.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-[#F90070] text-2xl">
                  ₹{courseData.length > 0 ? courseData?.reduce((sum, course) => sum + course.price, 0) : 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Course Prices Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Sales Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    angle={-30} // Rotated labels for better visibility
                    textAnchor="end"
                    interval={0} // Display all labels
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#F90070" // Changed color to a different shade of blue
                    strokeWidth={3}
                    dot={{ stroke: "#F90070", strokeWidth: 2,style: { cursor: "pointer" }, }} // Same color for the dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      )}
    </section>
  );
};

export default Dashboard;
