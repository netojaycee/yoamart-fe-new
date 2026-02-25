"use client";
import { useForm } from "react-hook-form";
import { useCreateBatchMutation, useGetAllBatchesQuery } from "@/redux/appData";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateBatchFormProps {
  onSuccess?: () => void;
  products: Product[];
}

interface BatchFormData {
  productId: string;
  expiryDate: string;
  productionDate: string;
  quantityTotal: number;
}

export default function CreateBatchForm({ onSuccess, products }: CreateBatchFormProps) {
  const [createBatch, { isLoading }] = useCreateBatchMutation();
  const { refetch } = useGetAllBatchesQuery({ page: 1, limit: 10 });
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BatchFormData>();

  const onSubmit = async (data: BatchFormData) => {
    try {
      // Validation
      if (!data.productId) {
        toast.error("Please select a product");
        return;
      }
      if (!data.expiryDate) {
        toast.error("Please select an expiry date");
        return;
      }
      if (!data.productionDate) {
        toast.error("Please select a production date");
        return;
      }
      if (data.quantityTotal <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      // Submit
      await createBatch({
        productId: data.productId,
        expiryDate: data.expiryDate,
        productionDate: data.productionDate,
        quantityTotal: data.quantityTotal,
      }).unwrap();

      // Refetch batches
      refetch();
      onSuccess?.();
    } catch (error: unknown) {
      interface ErrorResponse {
        data?: { message?: string };
      }
      const err = error as ErrorResponse;
      const errorMessage = err?.data?.message || "Failed to create batch";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Product Selection */}
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select
          onValueChange={(value) => setValue("productId", value)}
          defaultValue=""
        >
          <SelectTrigger id="product">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product._id} value={product._id}>
                {product.name} (₦{product.price.toFixed(2)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && (
          <p className="text-sm text-red-500">{errors.productId.message}</p>
        )}
      </div>

      {/* Production Date */}
      <div className="space-y-2">
        <Label htmlFor="productionDate">Production Date</Label>
        <Input
          id="productionDate"
          type="date"
          {...register("productionDate")}
        />
        {errors.productionDate && (
          <p className="text-sm text-red-500">{errors.productionDate.message}</p>
        )}
      </div>

      {/* Expiry Date */}
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          {...register("expiryDate")}
        />
        {errors.expiryDate && (
          <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
        )}
      </div>

      {/* Total Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Total Quantity</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="Enter quantity"
          {...register("quantityTotal", {
            valueAsNumber: true,
            min: 1,
          })}
        />
        {errors.quantityTotal && (
          <p className="text-sm text-red-500">{errors.quantityTotal.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isLoading ? "Creating..." : "Create Batch"}
      </Button>
    </form>
  );
}
