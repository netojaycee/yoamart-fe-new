"use client";
import CustomLoader from "@/components/local/CustomLoader";
import { Driver, Order } from "@/lib/types";
import {
  useConfirmOrderMutation,
  useConfirmPaymentMutation,
  useGetUserOrderByIdQuery,
  useGetDriversQuery,
} from "@/redux/appData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import ErrorMessage from "@/components/local/auth/errorMessage";
import { assignDriverSchema } from "@/lib/zodSchema";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Check, CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ErrorResponse = { data: { message: string } };

const Main = ({ orderId }: { orderId: string }) => {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, error } = useGetUserOrderByIdQuery(orderId);
  const { data: allDrivers, isLoading: isLoadingDrivers } =
    useGetDriversQuery(undefined);
  const drivers: Driver[] = allDrivers?.drivers;
  const [confirmPayment, { isLoading: isConfirming }] =
    useConfirmPaymentMutation();

  const [confirmOrder, { isLoading: isConfirmingOrder }] =
    useConfirmOrderMutation();

  const handleConfirmPayment = async () => {
    try {
      // Make the API call to toggle the status
      const response = await confirmPayment(orderId);
      // console.log(response);
      // Optionally handle the response from the server if needed
      if (response?.data?.message) {
        toast.success(response.data.message || "Success");
      } else if (
        "data" in (response?.error as FetchBaseQueryError) &&
        (response?.error as FetchBaseQueryError)?.data
      ) {
        const error = response.error as ErrorResponse;
        toast.error(error.data.message || "Error updating status");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("API call failed", error);
      // Revert the toggle if the API call fails
    }
  };

  const handleChangeOrderStatus = async () => {
    try {
      const response = await confirmOrder({ orderId });

      console.log(response);
      // Optionally handle the response from the server if needed
      if (response?.data?.message) {
        toast.success(response.data.message || "Success");
      } else if (
        "data" in (response?.error as FetchBaseQueryError) &&
        (response?.error as FetchBaseQueryError)?.data
      ) {
        const error = response.error as ErrorResponse;
        toast.error(error.data.message || "Error updating status");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("API call failed", error);
      // Revert the toggle if the API call fails
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Image
          src={"/images/error.png"}
          alt="Empty Wishlist"
          width={200} // Adjust the width as needed
          height={200} // Adjust the height as needed
          className="mb-6"
        />
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Order Not Found!
        </h2>
        <Button
          onClick={() => (window.location.href = `/admin/orders/`)} // Redirect to the store page
          className="bg-ysecondary text-white px-6 py-2 rounded hover:bg-primary/80"
        >
          All Orders
        </Button>
      </div>
    );
  }
  const order: Order = data.order;
  // console.log(data);
  return (
    <div className="">
      {/* Order Header */}
      <div className="bg-white shadow-sm rounded-md p-6 mb-8">
        <p className="text-sm text-gray-600">
          Order <span className="font-semibold">#{order._id}</span> was placed
          on{" "}
          <span className="font-semibold">
            {order?.createdAt
              ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(order?.createdAt))
              : "N/A"}
          </span>{" "}
          and is currently{" "}
          <span className="text-yellow-600">{order.orderStatus}</span>.
        </p>
      </div>

      {/* Order Details Table */}
      <div className="bg-white shadow-sm rounded-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold ">Order Details</h3>
          {order.isPaid === "processing" ? (
            <Button onClick={handleConfirmPayment} className="bg-ysecondary">
              Confirm Payment{" "}
              {isConfirming ? <Loader className="animate-spin" /> : <Check />}
            </Button>
          ) : order.isPaid === "paid" ? (
            <Button
              disabled={order.orderStatus === "completed"}
              onClick={
                order.orderStatus === "pending"
                  ? () => setOpen(true)
                  : handleChangeOrderStatus
              }
              className={`${order.orderStatus === "completed" ? "bg-green-500" :"bg-ysecondary"}`}
            >
              {order.orderStatus === "pending"
                ? "mark as Shipped"
                : order.orderStatus === "shipped"
                ? "mark as delivered"
                : "completed"}{" "}
              {isConfirmingOrder ? (
                <Loader className="animate-spin" />
              ) : (
                <Check />
              )}{" "}
            </Button>
          ) : null}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b border-gray-200">Product</th>
                <th className="py-2 px-4 border-b border-gray-200 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.cart.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {item.name} &times; {item.quantity}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.price * item.quantity)}{" "}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-2 px-4 border-b border-gray-200 font-semibold">
                  Subtotal:
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.subTotal)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200 font-semibold">
                  Shipping fee:
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.shippingFee)}{" "}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium border-b border-gray-200">
                  Total:
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.total)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium border-b border-gray-200">
                  Shipping Type:
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">
                  {order?.shippingFee === 0
                    ? "Local pickup"
                    : `Flat rate (${
                        order?.shippingFee === 3500
                          ? "Lagos to Mainland"
                          : "Lagos to Island"
                      })`}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium border-b border-gray-200">
                  Payment method:
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">
                  Direct bank transfer
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold border-b border-gray-200">
                  Note:
                </td>
                <td className="py-2 px-4 text-right border-b border-gray-200">
                  {order.note}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-4 font-semibold">Order Reference:</td>
                <td className="py-2 px-4 text-right">{order.orderNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address */}
        {/* <div className="bg-white shadow-sm rounded-md p-6">
          <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
          <p>{session?.name}</p>
          <p className="">{session?.address}</p>
          <p>{session?.phone}</p>
          <p>{session?.email}</p>
        </div> */}

        {/* Shipping Address */}
        <div className="bg-white shadow-sm rounded-md p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
          <p>{order?.name}</p>
          <p className="">{order?.address}</p>
          <p>{order?.mobile}</p>
          <p>{order?.email}</p>
        </div>
      </div>

      <AssignDriver
        open={open}
        setOpen={setOpen}
        drivers={drivers}
        isLoadingDrivers={isLoadingDrivers}
        orderId={orderId}
      />
    </div>
  );
};

export default Main;

function AssignDriver({
  open,
  setOpen,
  drivers,
  isLoadingDrivers,
  orderId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  drivers: { name: string; phone: string; _id: string }[];
  isLoadingDrivers: boolean;
  orderId: string;
}) {
  const [globalError, setGlobalError] = useState<string>("");

  const [confirmOrder, { isLoading: isMarking }] = useConfirmOrderMutation();

  const form = useForm<z.infer<typeof assignDriverSchema>>({
    resolver: zodResolver(assignDriverSchema),
    defaultValues: {
      driverId: "",
      expectedDeliveryDate: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof assignDriverSchema>) => {
    setGlobalError("");
    try {
      // Make the API call to toggle the status
      const credentials = {
        expectedDeliveryDate: values.expectedDeliveryDate,
        driverId: values.driverId,
      };
      const response = await confirmOrder({ credentials, orderId });

      console.log(response);
      // Optionally handle the response from the server if needed
      if (response?.data?.message) {
        setOpen(false);
        toast.success(response.data.message || "Success");
      } else if (
        "data" in (response?.error as FetchBaseQueryError) &&
        (response?.error as FetchBaseQueryError)?.data
      ) {
        const error = response.error as ErrorResponse;
        toast.error(error.data.message || "Error updating status");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("API call failed", error);
      // Revert the toggle if the API call fails
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Shipping Details</DialogTitle>
          <DialogDescription>
            Please select a driver and fill in the expected delivery date to
            update order status to shipped.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          {globalError && <ErrorMessage error={globalError} />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-[5px]">
                <Label htmlFor="driverId" className="text-xs">
                  Driver
                </Label>
                <Controller
                  name="driverId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectGroup>
                          {isLoadingDrivers ? (
                            <div className="flex items-center gap-1 text-xs">
                              <Loader className="animate-spin" />
                              <span>Loading drivers...</span>
                            </div>
                          ) : drivers && drivers.length > 0 ? (
                            drivers.map((driver) => (
                              <SelectItem key={driver._id} value={driver._id}>
                                {driver.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="flex items-center gap-1 text-xs">
                              No drivers available.
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Label
                      htmlFor="expectedDeliveryDate"
                      className="text-xs mb-[5px]"
                    >
                      Expected Date of Delivery
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 " align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      This date is emailed to the buyer in other to anticipate
                      order delivery.{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-end mt-3">
                {isMarking ? (
                  <Button
                    disabled
                    className="bg-ysecondary flex items-center justify-center gap-1"
                    type="submit"
                  >
                    <span>Please wait</span>
                    <Loader className="animate-spin" />
                  </Button>
                ) : (
                  <Button className="bg-yprimary " type="submit">
                    Ship
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
