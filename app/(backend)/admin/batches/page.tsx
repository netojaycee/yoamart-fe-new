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
import { useGetAllBatchesQuery, useGetAllProductQuery } from "@/redux/appData";
import { toast } from "sonner";
import CustomLoader from "@/components/local/CustomLoader";
import PaginationComponent from "@/components/local/PaginationComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateBatchForm from "./components/CreateBatchForm";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500",
  NEAR_EXPIRY: "bg-yellow-500",
  EXPIRED: "bg-red-500",
  REMOVED: "bg-gray-500",
  DISPOSED_RETURNED: "bg-blue-500",
};

const STATUS_OPTIONS = ["ACTIVE", "NEAR_EXPIRY", "EXPIRED", "REMOVED", "DISPOSED_RETURNED"];

interface Batch {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  expiryDate: string;
  productionDate: string;
  quantityTotal: number;
  quantityAvailable: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function BatchesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetAllBatchesQuery(
    { page, limit, status: selectedStatus },
    { refetchOnMountOrArgChange: true }
  );

  const { data: productsData } = useGetAllProductQuery({
    page: 1,
    limit: 1000,
  });

  const batches: Batch[] = data?.batches || [];
  const pages = data?.pages || 1;

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === "ALL" ? undefined : status);
    setPage(1);
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Batch Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track product batches by expiry date</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>
                Add a new product batch for expiry tracking
              </DialogDescription>
            </DialogHeader>
            <CreateBatchForm 
              onSuccess={() => {
                setDialogOpen(false);
                toast.success("Batch created successfully!");
              }}
              products={productsData?.products || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Filter by Status</label>
            <Select value={selectedStatus || "ALL"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-6">
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedStatus(undefined);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Active Batches</p>
          <p className="text-2xl font-bold text-gray-800">
            {batches.filter((b) => b.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Near Expiry</p>
          <p className="text-2xl font-bold text-gray-800">
            {batches.filter((b) => b.status === "NEAR_EXPIRY").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-bold text-gray-800">
            {batches.filter((b) => b.status === "EXPIRED").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Quantity</p>
          <p className="text-2xl font-bold text-gray-800">
            {batches.reduce((sum, b) => sum + b.quantityAvailable, 0)}
          </p>
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
              <h3 className="font-semibold text-red-800">Error loading batches</h3>
              <p className="text-sm text-red-700">Failed to fetch batch data. Please try again.</p>
            </div>
          </div>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No batches found. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>List of all product batches</TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px]">Product</TableHead>
                  <TableHead className="w-[120px]">Expiry Date</TableHead>
                  <TableHead className="text-center">Days Left</TableHead>
                  <TableHead className="text-center">Total Qty</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-center w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => {
                  const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                  return (
                    <TableRow key={batch._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{batch.productId.name}</p>
                          <p className="text-xs text-gray-500">₦{batch.productId.price.toFixed(2)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            daysLeft < 0
                              ? "bg-red-100 text-red-700"
                              : daysLeft <= 3
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {daysLeft < 0 ? "EXPIRED" : `${daysLeft} days`}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {batch.quantityTotal}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {batch.quantityAvailable}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${STATUS_COLORS[batch.status] || "bg-gray-400"}`}
                        >
                          {batch.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <span className="text-blue-600 hover:text-blue-800">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {batches.length > 0 && (
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
