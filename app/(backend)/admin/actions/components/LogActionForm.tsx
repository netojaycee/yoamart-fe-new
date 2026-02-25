"use client";
import { useForm } from "react-hook-form";
import { useLogActionMutation, useGetAllActionsQuery } from "@/redux/appData";
import { Batch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LogActionFormProps {
  onSuccess?: () => void;
  batches: Batch[];
}

interface ActionFormData {
  batchId: string;
  alertId?: string;
  actionType: string;
  quantityAffected: number;
  performedBy: string;
  notes: string;
}

const ACTION_TYPES = [
  { label: "Removed from Shelf", value: "REMOVED_FROM_SHELF" },
  { label: "Disposed", value: "DISPOSED" },
  { label: "Returned to Supplier", value: "RETURNED_TO_SUPPLIER" },
  { label: "Recounted", value: "RECOUNTED" },
  { label: "Other", value: "OTHER" },
];

export default function LogActionForm({ onSuccess, batches }: LogActionFormProps) {
  const [logAction, { isLoading }] = useLogActionMutation();
  const { refetch } = useGetAllActionsQuery({ page: 1, limit: 10 });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActionFormData>();

  const selectedBatchId = watch("batchId");
  const selectedBatch = batches.find((b) => b._id === selectedBatchId);
  const maxQuantity = selectedBatch?.quantityAvailable || 0;

  const onSubmit = async (data: ActionFormData) => {
    try {
      // Validation
      if (!data.batchId) {
        toast.error("Please select a batch");
        return;
      }
      if (!data.actionType) {
        toast.error("Please select an action type");
        return;
      }
      if (data.quantityAffected <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }
      if (data.quantityAffected > maxQuantity) {
        toast.error(`Quantity cannot exceed available quantity (${maxQuantity})`);
        return;
      }
      if (!data.performedBy) {
        toast.error("Please enter your name");
        return;
      }

      // Submit
      const payload: Record<string, any> = {
        batchId: data.batchId,
        actionType: data.actionType,
        quantityAffected: data.quantityAffected,
        performedBy: data.performedBy,
        notes: data.notes || "",
      };

      if (data.alertId) {
        payload.alertId = data.alertId;
      }

      await logAction(payload).unwrap();

      // Refetch actions
      refetch();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = (error as any)?.data?.message || "Failed to log action";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Batch Selection */}
      <div className="space-y-2">
        <Label htmlFor="batch">Batch / Product</Label>
        <Select onValueChange={(value) => setValue("batchId", value)} defaultValue="">
          <SelectTrigger id="batch">
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch._id} value={batch._id}>
                {batch.productId.name} (Available: {batch.quantityAvailable})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.batchId && (
          <p className="text-sm text-red-500">{errors.batchId.message}</p>
        )}
      </div>

      {/* Action Type */}
      <div className="space-y-2">
        <Label htmlFor="actionType">Action Type</Label>
        <Select
          onValueChange={(value) => setValue("actionType", value)}
          defaultValue=""
        >
          <SelectTrigger id="actionType">
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.actionType && (
          <p className="text-sm text-red-500">{errors.actionType.message}</p>
        )}
      </div>

      {/* Quantity Affected */}
      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantity Affected {maxQuantity > 0 && `(Max: ${maxQuantity})`}
        </Label>
        <Input
          id="quantity"
          type="number"
          placeholder="Enter quantity"
          {...register("quantityAffected", {
            valueAsNumber: true,
            min: 1,
            max: maxQuantity,
          })}
        />
        {errors.quantityAffected && (
          <p className="text-sm text-red-500">{errors.quantityAffected.message}</p>
        )}
      </div>

      {/* Staff Name */}
      <div className="space-y-2">
        <Label htmlFor="staffName">Your Name</Label>
        <Input
          id="staffName"
          placeholder="Enter your name"
          {...register("performedBy")}
        />
        {errors.performedBy && (
          <p className="text-sm text-red-500">{errors.performedBy.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional details about this action"
          {...register("notes")}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isLoading ? "Logging..." : "Log Action"}
      </Button>
    </form>
  );
}
