"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/local/auth/errorMessage";
import { Loader } from "lucide-react";
import { updateProfileSchema } from "@/lib/zodSchema";
import { useUpdateProfileMutation } from "@/redux/appData";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/types";

export default function AccountDetails() {
  const [globalError, setGlobalError] = useState<string>("");
  const session = useSelector((state: RootState) => state.auth.userData);

  const [updateProfile, { isLoading, isSuccess, isError, error }] =
    useUpdateProfileMutation();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.name || "",
      email: session?.email || "",
      phone: session?.phone || "",
      address: session?.address || "",
      currentPassword: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    setGlobalError(""); // Reset global error before submission
    try {
       await updateProfile(values);
    } catch (error) {
      // toast.error("An unexpected error occurred.");
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success(`update Successful`, {
        position: "top-center",
      });
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        const errorMessage = (error.data as { message?: string })?.message;
        setGlobalError(errorMessage || "Update failed.");
        toast.error(errorMessage || "Update failed.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <>
      <div className="my-10 px-2 md:px-10">
        {globalError && <ErrorMessage error={globalError} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your phone number"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
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
                      type="text"
                      placeholder="Enter your address"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h2 className="text-[#202045] font-dosis font-semibold text-[25px] my-10">
              Password Change
            </h2>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    New Password (leave blank to leave unchanged)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    Confirm New Password (leave blank to leave unchanged)
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              {isLoading ? (
                <Button
                  disabled
                  className="bg-ysecondary/70 flex items-center justify-center gap-1"
                  type="submit"
                >
                  {" "}
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button className="bg-ysecondary" type="submit">
                  Update Profile
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
