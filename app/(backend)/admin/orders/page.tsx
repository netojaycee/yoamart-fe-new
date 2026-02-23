"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllOrdersQuery } from "@/redux/appData";
import { Order } from "@/lib/types";

import CustomLoader from "@/components/local/CustomLoader";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function AdminOrders() {
  const { data, isLoading } = useGetAllOrdersQuery(undefined);

  console.log(data);
  const orders: Order[] = data ? data.allOrders : [];

  const ordersToDisplay = orders.filter((order) => order?.isPaid !== "unpaid");

  return (
    <>
      <h1 className="font-dosis font-semibold">Orders</h1>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <div className="overflow-x-auto w-full">
          <Table>
            <TableCaption>A list of all your Orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="">Payment Status</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead>Order Status</TableHead>

                <TableHead className="w-[200px] text-center">Date</TableHead>
                {/* <TableHead className="">OrderId</TableHead> */}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ordersToDisplay &&
                ordersToDisplay.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.email}</TableCell>

                    <TableCell
                      className={` ${
                        item?.isPaid === "unpaid"
                          ? "bg-red-500"
                          : item?.isPaid === "processing"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } text-center w-12`}
                    >
                      {item?.isPaid}
                    </TableCell>

                    <TableCell className="text-center w-12">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(item?.total)}
                    </TableCell>
                    <TableCell
                      className={` ${
                        item?.orderStatus === "pending"
                          ? "bg-red-500"
                          : item?.orderStatus === "processing"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } text-center w-12`}
                    >
                      {item?.orderStatus}
                    </TableCell>
                    <TableCell className="text-center w-12">
                      {item?.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(item?.createdAt))
                        : "N/A"}
                    </TableCell>
                    {/* <TableCell className="">{item?._id}</TableCell> */}
                    <TableCell className="space-y-5 w-12 font-dosis font-bold hover:bg-gray-300 ">
                      <Link
                        className="flex gap-2 items-center flex-row justify-center"
                        href={`/admin/orders/${item?._id}`}
                      >
                        view <Eye className="w-4 h-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* <PaginationComponent
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        currentPage={page}
        totalPages={totalPages}
      /> */}
    </>
  );
}
