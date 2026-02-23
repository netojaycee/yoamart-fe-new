"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner"; // Assuming you are using react-hot-toast for notifications
import { Loader } from "lucide-react"; // Assuming you're using this for the loader
import {
  useDeleteCategoryMutation,
  useDeleteDriverMutation,
  useDeleteProductMutation,
} from "@/redux/appData";
import { Category, Product } from "@/lib/types";

export default function DeleteForm({
  data,
  onClose,
  title,
}: {
  data: Product | Category | undefined;
  title: string;
  onClose: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  // console.log(data)
  const [deleteProduct] = useDeleteProductMutation();
  // Handle delete
  const handleDelete = async () => {
    try {
      setIsLoading(true); // Start loading
      let result;

      // Check the title and call the appropriate deletion function
      if (title === "category") {
        result = await deleteCategory(data?._id); // Delete category
      }
      if (title === "product") {
        result = await deleteProduct(data?._id); // Delete category
      }

      if (title === "driver") {
        result = await deleteDriver(data?._id); // Delete category
      }

      // If the deletion was successful, show a success toast and close the dialog
      if (result && result?.data) {
        toast.success("Delete Successful");
        onClose(false); // Close the dialog after deletion
      } else {
        toast.error(result?.data?.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form className="grid py-4" onSubmit={(e) => e.preventDefault()}>
      <div className="text-center">
        <DialogTitle>Are you sure you want to delete {data?.name}?</DialogTitle>
      </div>
      <div className="flex w-[50%] mx-auto justify-between">
        <Button
          type="button"
          onClick={() => onClose(false)}
          disabled={isLoading} // Disable button while loading
        >
          NO
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader className="mr-2 animate-spin" size={16} /> Deleting
              <span className="animate-ping">...</span>
            </div>
          ) : (
            "YES"
          )}
        </Button>
      </div>
    </form>
  );
}
