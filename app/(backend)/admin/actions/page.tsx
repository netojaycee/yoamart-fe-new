"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGetAllActionsQuery, useGetAllBatchesQuery } from "@/redux/appData";
import { toast } from "sonner";
import CustomLoader from "@/components/local/CustomLoader";
import PaginationComponent from "@/components/local/PaginationComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LogActionForm from "./components/LogActionForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Batch } from "@/lib/types";

interface Action {
  _id: string;
  batchId: {
    _id: string;
    productId: {
      name: string;
    };
  };
  alertId?: {
    _id: string;
    alertType: string;
  };
  actionType: string;
  quantityAffected: number;
  performedBy: string;
  performedAt: string;
  notes: string;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  REMOVED_FROM_SHELF: "bg-blue-100 text-blue-700",
  DISPOSED: "bg-red-100 text-red-700",
  RETURNED_TO_SUPPLIER: "bg-purple-100 text-purple-700",
  RECOUNTED: "bg-green-100 text-green-700",
  OTHER: "bg-gray-100 text-gray-700",
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export default function ActionHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedBatch, setSelectedBatch] = useState<string | undefined>(undefined);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllActionsQuery(
    { page, limit, batchId: selectedBatch },
    { refetchOnMountOrArgChange: true }
  );

  const { data: batchesData } = useGetAllBatchesQuery({
    page: 1,
    limit: 1000,
  });

  const actions: Action[] = data?.actions || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;
  const batches = batchesData?.batches || [];

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Action History</h1>
          <p className="text-sm text-gray-500 mt-1">Track all staff actions on batches</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Log Action
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Action</DialogTitle>
              <DialogDescription>
                Record an action taken on a batch (removal, disposal, return, etc.)
              </DialogDescription>
            </DialogHeader>
            <LogActionForm
              onSuccess={() => {
                setDialogOpen(false);
                toast.success("Action logged successfully!");
                refetch();
              }}
              batches={batches}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Actions Today</p>
          <p className="text-2xl font-bold text-gray-800">
            {actions.filter((a) => {
              const today = new Date().toDateString();
              return new Date(a.performedAt).toDateString() === today;
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Disposed</p>
          <p className="text-2xl font-bold text-gray-800">
            {actions
              .filter((a) => a.actionType === "DISPOSED")
              .reduce((sum, a) => sum + a.quantityAffected, 0)}
            {" units"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Actions</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Filter by Batch</label>
            <Select value={selectedBatch || "all-batches"} onValueChange={(value) => {
              setSelectedBatch(value === "all-batches" ? undefined : value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-batches">All Batches</SelectItem>
                {batches.map((batch: Batch) => (
                  <SelectItem key={batch._id} value={batch._id}>
                    {batch.productId.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBatch(undefined);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <CustomLoader />
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Error loading actions</h3>
              <p className="text-sm text-red-700">Failed to fetch action history. Please try again.</p>
            </div>
          </div>
        </div>
      ) : actions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No actions recorded yet. Start logging actions!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Complete action history</TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Product</TableHead>
                  <TableHead>Action Type</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="w-[200px]">Notes</TableHead>
                  <TableHead className="text-center">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action._id} className="hover:bg-gray-50">
                    <TableCell className="font-semibold">
                      {action.batchId.productId.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[action.actionType] || ACTION_COLORS.OTHER}`}
                      >
                        {action.actionType}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {action.quantityAffected}
                    </TableCell>
                    <TableCell className="font-medium">
                      {action.performedBy}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(action.performedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-xs truncate">
                      {action.notes || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        <span className="text-blue-600 hover:text-blue-800 text-xs">Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {actions.length > 0 && (
        <div className="mt-6">
          <PaginationComponent
            page={page}
            pages={pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
