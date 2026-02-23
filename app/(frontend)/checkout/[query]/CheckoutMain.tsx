"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/local/auth/errorMessage";
import { Textarea } from "@/components/ui/textarea";

import { Loader } from "lucide-react";
import { checkoutSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order } from "@/lib/types";
import {
  useGetUserOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/redux/appData";
import { notFound, useRouter } from "next/navigation";
import CustomLoader from "@/components/local/CustomLoader";
import { toast } from "sonner";

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutMain({ orderId }: { orderId: string }) {
  const [globalError, setGlobalError] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const router = useRouter();

  const {
    data,
    isLoading: isLoadingOrder,
    error: errorOrder,
  } = useGetUserOrderByIdQuery(orderId);

  const order: Order = data?.order;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      name: "",
      address: "",
      phone: "",
      note: "",
    },
  });

  React.useEffect(() => {
    if (order) {
      form.reset({
        email: order.email || "",
        name: order.name || "",
        address: order.address || "",
        phone: order.mobile || "",
        note: order.note || "",
      });
    }
  }, [order, form]);

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const onSubmit = async (values: CheckoutFormValues) => {
    setGlobalError("");
    try {
      if (!termsAccepted) {
        setGlobalError(
          "Please read and accept the terms and conditions to proceed with your order."
        );

        window.scrollTo({ top: 0, behavior: "smooth" });

        return;
      }

      const credentials = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        note: values.note,
        orderNumber: order?.orderNumber,
      };
      const result = await updateOrder({
        credentials,
        orderId,
      });
      // console.log(result);
      if (result?.data) {
        toast.success("order placed successfully");

        router.push(`/order-recieved/${result?.data?.order?._id}`);
      } else {
        toast.error("An unexpected error occurred.");
        setGlobalError("An unexpected error occurred.");
      }
    } catch (error) {
      // toast.error("An unexpected error occurred.");
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    if (
      termsAccepted &&
      globalError ===
        "Please read and accept the terms and conditions to proceed with your order."
    ) {
      setGlobalError("");
      return;
    }
  }, [globalError, termsAccepted]);

  if (isLoadingOrder) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (errorOrder) {
    notFound();
  }

  return (
    <div className=" px-2 md:px-10 my-10">
      <div className="flex lg:flex-row flex-col gap-6 items-start">
        {/* Billing Details */}
        <div className="border rounded-lg p-5 w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

          <div className="">
            {globalError && <ErrorMessage error={globalError} />}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="p-5 bg-gray-100"
                          type="text"
                          placeholder="Enter your full name"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          className="p-5 bg-gray-100"
                          type="text"
                          placeholder="Enter your delivery address"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center md:flex-row flex-col gap-2 md:gap-5 w-full">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              className="p-5 bg-gray-100 w-full"
                              type="email"
                              placeholder="Enter your email"
                              autoComplete="off"
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              className="p-5 bg-gray-100 w-full"
                              type="text"
                              placeholder="Enter your phone number"
                              autoComplete="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator className="my-5" />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className=" bg-gray-100"
                          placeholder="Notes about your order e.g special notes for your delivery."
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-2 border-ysecondary rounded-lg p-5 lg:w-1/3 w-full">
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400 text-sm">
              Products
            </span>
            <span className="font-semibold text-gray-400 text-sm">
              SubTotal
            </span>
          </div>
          <Separator className="my-2" />
          <div className="bg-gray-100 p-4 rounded-lg">
            {order?.cart?.map((item) => (
              <div
                key={item?._id}
                className="flex justify-between items-center"
              >
                <span className="text-sm w-[80%]">
                  {item?.name}
                  <span className="font-bold px-2">x {item?.quantity}</span>
                </span>
                <span>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(item?.price * item?.quantity)}
                </span>
              </div>
            ))}

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span> {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.subTotal ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Shipping fee</span>
                <span>{new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.shippingFee ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-400">Total</span>
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order?.total ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="radio"
                  id="bank-transfer"
                  name="payment"
                  className="text-ysecondary border-gray-300 focus:ring-yprimary/70 focus:border-yprimary/70 mt-1"
                  checked
                  readOnly
                />
                <label
                  htmlFor="bank-transfer"
                  className="ml-2 text-sm text-ysecondary font-semibold"
                >
                  Direct bank transfer
                </label>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 mt-2">
                <p>
                  <strong>Bank Name:</strong> Zenith Bank
                </p>
                <p>
                  <strong>Account Name:</strong> YOA Supermarket
                </p>
                <p>
                  <strong>Account Number:</strong> 1229146777
                </p>
                <p>
                  <strong>Order Reference:</strong>{" "}
                  <span className="text-ysecondary font-semibold">
                    {order?.orderNumber}
                  </span>
                </p>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Please use the Order Reference as the payment reference.
                  Include your order reference number in the transaction
                  description. Your order will not be processed until the funds
                  have cleared in our account.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="text-ysecondary border-gray-300 rounded shadow-sm focus:ring-yprimary/70 focus:border-yprimary/70"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="ml-2 text-xs text-gray-700">
                  I have read and agree to the website{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-ysecondary/80 underline underline-offset-1"
                  >
                    terms and conditions
                  </Link>
                </span>
              </label>
            </div>
            <div className="w-full mt-4">
              {isLoading ? (
                <Button
                  disabled
                  className="bg-ysecondary hover:bg-ysecondary/80 flex items-center justify-center gap-1 w-full"
                  type="submit"
                >
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button
                  className="bg-ysecondary hover:bg-ysecondary/80 w-full"
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Place order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
