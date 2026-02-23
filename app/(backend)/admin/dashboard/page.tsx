"use client";
import { clearCredentials } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts"; // Example chart
import { useGetChartQuery, useGetSummaryQuery } from "@/redux/appData";
import { Loader, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Helper function to format numbers as Naira (₦)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0, // Remove decimal places
  }).format(value);
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token");

    // Dispatch logout to clear Redux state
    dispatch(clearCredentials());

    // Redirect the user to the login page (or any other page)
    router.push("/my-account");
  };

  const { data, isLoading, error } = useGetChartQuery(undefined);
  const { data: summary, isLoading: isLoadingSummary } =
    useGetSummaryQuery(undefined);

  const chartConfig = {
    month: {
      label: "Month",
      color: "#960018",
    },
  } satisfies ChartConfig;
  // Sample data for chart (You would fetch this from your backend)
  const chartData =
    data &&
    data?.sales.map(
      (item: { month: string; totalSales: number; totalOrders: number }) => ({
        month: item.month,
        sales: item.totalSales,
        orders: item.totalOrders,
      })
    );

  return (
    <div className="flex-1  p-8">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            <LogOut className="" />
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sales Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Total Sales</h3>
          <p className="text-3xl">
            {isLoadingSummary ? (
              <Loader className="animate-spin text-ysecondary" />
            ) : summary?.totalSales !== undefined ? (
              new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(summary.totalSales)
            ) : (
              "₦0.00" // Default value if totalSales is undefined
            )}
          </p>

          <p className="text-sm text-gray-500">Since last month</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Total Orders</h3>
          <p className="text-3xl">
            {isLoadingSummary ? (
              <Loader className="animate-spin text-ysecondary" />
            ) : summary?.totalOrders !== undefined ? (
              summary.totalOrders
            ) : (
              "0"
            )}
          </p>

          <p className="text-sm text-gray-500">Since last month</p>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-3xl">
            {isLoadingSummary ? (
              <Loader className="animate-spin text-ysecondary" />
            ) : summary?.totalUsers !== undefined ? (
              summary.totalUsers
            ) : (
              "0"
            )}
          </p>

          <p className="text-sm text-gray-500">Active users</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <Loader className="animate-spin text-ysecondary" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">Failed to load data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent

                      // formatter={(value) => formatCurrency(value as number)}
                      // hideLabel
                      />
                    }
                  />
                  <Bar dataKey="sales" fill="#8884d8" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value: number) =>
                        formatCurrency(value as number)
                      }
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Orders Overview</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <Loader className="animate-spin text-ysecondary" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">Failed to load data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    // content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="orders" fill="#8884d8" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
