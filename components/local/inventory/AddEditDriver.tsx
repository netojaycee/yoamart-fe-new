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

import {
  useCreateDriverMutation,
  useEditDriverMutation,
} from "@/redux/appData";
import { createDriverSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import ErrorMessage from "../auth/errorMessage";
import { Category, Driver, Product } from "@/lib/types";

type ProductProp = z.infer<typeof createDriverSchema>;

export default function AddEditDriver({
  data,
  onClose,

  type,
}: {
  data: Product | Driver | Category | undefined;
  type: string;
  onClose: (open: boolean) => void;
}) {
  const [globalError, setGlobalError] = useState<string>("");

  const [createDriver, { isLoading }] = useCreateDriverMutation();

  const [editDriver] = useEditDriverMutation();

  const form = useForm<ProductProp>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: {
      name: type === "edit" ? data?.name : "",
      phone: type === "edit" ? data?.phone : "",
    },
  });

  const onSubmit = async (values: ProductProp) => {
    try {
      setGlobalError("");

      console.log(values);

      // Decide whether to create or update a product
      const result =
        type === "edit"
          ? await editDriver({ credentials: values, driverId: data?._id }) // Call the edit API
          : await createDriver(values); // Call the add API

          console.log(result)
      if (result?.data) {
        toast.success(
          type === "edit"
            ? "driver updated successfully!"
            : "driver added successfully!"
        );
        form.reset();

        onClose(false);
      } else {
        toast.error(
          type === "edit" ? "Failed to update driver." : "Failed to add driver."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <div className="">
      {" "}
      {globalError && <ErrorMessage error={globalError} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name" className="text-xs">
                  Name
                </Label>
                <FormControl>
                  <Input id="name" {...field} className="w-full" />
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
                <Label htmlFor="phone" className="text-xs">
                  Phone
                </Label>
                <FormControl>
                  <Input id="phone" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end mt-4">
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
                Save
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
