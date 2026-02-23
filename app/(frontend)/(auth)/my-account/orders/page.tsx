"use client";
import CustomLoader from "@/components/local/CustomLoader";
import NoItemFound from "@/components/local/NoItemFound";
import { Order } from "@/lib/types";
import { useGetAllUserOrdersQuery } from "@/redux/appData";
import Image from "next/image";
import React from "react";

export default function OrderDetails() {
  const {
    data,
    isLoading,
    // error: errorCategories,
  } = useGetAllUserOrdersQuery(undefined);
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }
  const orderss: Order[] = data?.orders;

  if (orderss.length === 0) {
    return (
      <NoItemFound
        title1="No Orders Found"
        title2="Add items to Cart and place an order"
      />
    );
  }
  return (
    <div className="px-2 md:px-10">
      <div className="p-6 my-10">
        {orderss?.map((order) => (
          <div key={order?._id} className="mb-6 border-2 p-5 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Order:</span>{" "}
                  <a
                    href={`/my-account/orders/${order._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    #{order._id}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Date:</span>{" "}
                  {order?.createdAt
                    ? new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(order?.createdAt))
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Order Status:
                  <span
                    className={`font-semibold ${
                      order.orderStatus === "pending"
                        ? "text-orange-500"
                        : order.orderStatus === "processing"
                        ? "text-yellow-400"
                        : "text-green-500"
                    }`}
                  >
                    {" "}
                    {order.orderStatus}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Payment Status:
                  <span
                    className={`font-semibold ${
                      order.isPaid === "unpaid"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {" "}
                    {order.isPaid}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Total:</span>{" "}
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order.total)}{" "}
                </p>
              </div>
              <div className="">
                <a
                  href={`/my-account/orders/${order._id}`}
                  className="text-white bg-ysecondary hover:bg-ysecondary/70 px-4 py-2 rounded text-sm"
                >
                  View
                </a>
              </div>
            </div>
            <div>
              {order.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-t py-4 first:border-t-0"
                >
                  <Image
                    src={item?.image[0]}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
