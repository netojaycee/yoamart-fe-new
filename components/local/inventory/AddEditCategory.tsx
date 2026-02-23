"use client";

import React, { useState } from "react";
import {  useForm } from "react-hook-form";
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
import Image from "next/image";
import { Loader } from "lucide-react";


import { uploadImageToCloudinary } from "@/lib/Cloudinary";
import {
  useCreateCategoryMutation,
  useEditCategoryMutation,
} from "@/redux/appData";
import { insertCategorySchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import ErrorMessage from "../auth/errorMessage";
import { Category, Product } from "@/lib/types";

type ProductProp = z.infer<typeof insertCategorySchema>;

export default function AddEditCategory({
  data,
  onClose,
 
  type,
}: {
  data: Product | Category | undefined;
  type: string;
  onClose: (open: boolean) => void;
}) {
  const [globalError, setGlobalError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | string[] | undefined>(
    type === "edit" ? data?.image : ""
  );


  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [editCategory] = useEditCategoryMutation();

  const form = useForm<ProductProp>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: type === "edit" ? data?.name : "",
      image: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    // Generate a local URL for image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Set the preview URL
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  const onSubmit = async (values: ProductProp) => {
    try {
      setGlobalError("");
      if (!imageFile && !imageUrl) {
        toast.error("Please upload an image.");
        return;
      }

      // Handle image upload if a new image is selected
      if (imageFile) {
        try {
          setLoading(true);
          const uploadedUrl = await uploadImageToCloudinary(imageFile);
          setImageUrl(uploadedUrl); // Set the image URL to the state
          values.image = uploadedUrl; // Add the image URL to the form values
          setLoading(false);
        } catch (error) {

          setLoading(false);
          console.error("Image upload failed:", error);
          toast.error("Failed to upload image.");
          return;
        }
      } else if (imageUrl) {
        // Use the existing image URL if no new file is uploaded
        values.image = imageUrl as string;
      }

      console.log(values);

      // Decide whether to create or update a product
      const result =
        type === "edit"
          ? await editCategory({ credentials: values, categoryId: data?._id }) // Call the edit API
          : await createCategory(values); // Call the add API

      if (result?.data) {
        toast.success(
          type === "edit"
            ? "Category updated successfully!"
            : "Category added successfully!"
        );
        form.reset();
        setImageFile(null);
        setImageUrl("");
        onClose(false);
      } else {
        toast.error(
          type === "edit"
            ? "Failed to update category."
            : "Failed to add category."
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

          
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col gap-1 w-[70%]">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <Label htmlFor="image" className="text-xs">
                      Upload Image
                    </Label>
                    <FormControl>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-[100px] h-[100px] bg-gray-300 p-1">
              {imageUrl && (
                <Image
                  src={imageUrl as string}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              )}
            </div>
          </div>

          <div className="w-full flex justify-end mt-4">
            {isLoading || loading ? (
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
