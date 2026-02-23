"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useCreateAdminMutation } from "@/redux/appData";
import { lostPasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import ErrorMessage from "@/components/local/auth/errorMessage";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type MakeAdmin = z.infer<typeof lostPasswordSchema>;
type ErrorResponse = { data: { message: string } };

export default function CreateAdmin() {
  const [globalError, setGlobalError] = useState<string>("");
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const form = useForm<MakeAdmin>({
    resolver: zodResolver(lostPasswordSchema),
    defaultValues: { email: "" },
  });

  const parseError = (error: FetchBaseQueryError | undefined) => {
    if (error && "data" in error) {
      const errorResponse = error as ErrorResponse;
      return errorResponse.data.message || "An error occurred.";
    }
    return "An unexpected error occurred.";
  };

  const onSubmit = async (values: MakeAdmin) => {
    try {
      setGlobalError("");
      const response = await createAdmin(values);
      if ("data" in response) {
        toast.success(response.data.message || "Role updated successfully!");
        form.reset();
      } else {
        const errorMessage = parseError(response.error as FetchBaseQueryError);
        setGlobalError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-md bg-white shadow-md p-6 rounded-md mt-5 md:mt-10">
        {/* Instructions Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Instructions</h2>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Purpose:</strong> Use this form to promote a user to an
            admin role by entering their email address.
          </p>
          <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
            <li>Enter the email of the user in the input box below.</li>
            <li>
              Click the <strong>&quot;Make Admin&quot;</strong> button.
            </li>
            <li>Wait for the confirmation message.</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            If there&apos;s an error, check the message displayed and try again.
          </p>
        </div>
      </div>
      <div className="max-w-md bg-white shadow-md p-6 rounded-md mt-5 md:mt-10">
        {/* Error Message */}
        {globalError && (
          <ErrorMessage error={globalError} aria-live="assertive" />
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="text-xs">
                    Email
                  </Label>
                  <FormControl>
                    <Input
                      id="email"
                      {...field}
                      className="w-full"
                      placeholder="enter email..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end mt-4">
              <Button
                disabled={isLoading}
                className="bg-ysecondary hover:bg-ysecondary/80 flex items-center justify-center gap-1"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <span>Please wait</span>
                    <Loader className="animate-spin" />
                  </>
                ) : (
                  "Make Admin"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
