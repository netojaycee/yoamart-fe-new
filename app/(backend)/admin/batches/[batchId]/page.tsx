"use client";
import { useParams, useRouter } from "next/navigation";
import {
  useGetBatchByIdQuery,
  useGetAlertsByBatchQuery,
  useGetActionsByBatchQuery,
} from "@/redux/appData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CustomLoader from "@/components/local/CustomLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Batch, Alert, Action } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500",
  NEAR_EXPIRY: "bg-yellow-500",
  EXPIRED: "bg-red-500",
  REMOVED: "bg-gray-500",
  DISPOSED_RETURNED: "bg-blue-500",
};

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

function formatDateOnly(dateString: string): string {
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

export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;

  // Fetch batch details
  const { data: batchData, isLoading: batchLoading, error: batchError } = useGetBatchByIdQuery(
    batchId
  );

  // Fetch alerts for this batch
  const { data: alertsData, isLoading: alertsLoading } = useGetAlertsByBatchQuery(batchId, {
    skip: !batchId,
  });

  // Fetch actions for this batch
  const { data: actionsData, isLoading: actionsLoading } = useGetActionsByBatchQuery(batchId, {
    skip: !batchId,
  });

  const batch = batchData?.batch as Batch | undefined;
  const alerts: Alert[] = alertsData?.alerts || [];
  const actions: Action[] = actionsData?.actions || [];

  if (batchLoading) {
    return <CustomLoader />;
  }

  if (batchError || !batch) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Error loading batch</h3>
              <p className="text-sm text-red-700">Failed to fetch batch details. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiry(batch.expiryDate);

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Batch Details</h1>
          <p className="text-sm text-gray-500">Batch ID: {batch._id}</p>
        </div>
      </div>

      {/* Batch Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <p>{batch.productId.name}</p>
              <p className="text-sm font-normal text-gray-600 mt-1">
                Product Information
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                STATUS_COLORS[batch.status] || "bg-gray-400"
              }`}
            >
              {batch.status}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Info */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Product Name</p>
              <p className="font-semibold text-gray-900">{batch.productId.name}</p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Unit Price</p>
              <p className="font-semibold text-gray-900">
                ₦{batch.productId.price.toFixed(2)}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-900">
                {batch.productId.category || "N/A"}
              </p>
            </div>

            {/* Total Value */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Batch Value</p>
              <p className="font-semibold text-gray-900">
                ₦{(batch.quantityTotal * batch.productId.price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Dates and Quantities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Production Date */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Production Date</p>
              <p className="font-semibold text-gray-900">
                {formatDateOnly(batch.productionDate)}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Expiry Date</p>
              <p className="font-semibold text-gray-900">
                {formatDateOnly(batch.expiryDate)}
              </p>
            </div>

            {/* Days Left */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Days Until Expiry</p>
              <p className="font-semibold">
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
              </p>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(batch.createdAt)}
              </p>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Quantity</p>
              <p className="text-3xl font-bold text-blue-600">{batch.quantityTotal}</p>
              <p className="text-xs text-gray-500">units</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Available Quantity</p>
              <p className="text-3xl font-bold text-green-600">{batch.quantityAvailable}</p>
              <p className="text-xs text-gray-500">units</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Used / Disposed</p>
              <p className="text-3xl font-bold text-red-600">
                {batch.quantityTotal - batch.quantityAvailable}
              </p>
              <p className="text-xs text-gray-500">units</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Actions Tabs */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="bg-white border-b w-full justify-start">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            Actions ({actions.length})
          </TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="mt-6">
          {alertsLoading ? (
            <CustomLoader />
          ) : alerts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No alerts for this batch</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Alerts triggered for this batch</TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Alert Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acknowledged By</TableHead>
                      <TableHead>Acknowledged At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert._id} className="hover:bg-gray-50">
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {alert.alertType}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(alert.alertDate)}</TableCell>
                        <TableCell>
                          {alert.acknowledged ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Open
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{alert.acknowledgedBy || "—"}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {alert.acknowledgedAt ? formatDate(alert.acknowledgedAt) : "—"}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="mt-6">
          {actionsLoading ? (
            <CustomLoader />
          ) : actions.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No actions recorded for this batch</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Staff actions recorded for this batch</TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Action Type</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="w-[250px]">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actions.map((action) => (
                      <TableRow key={action._id} className="hover:bg-gray-50">
                        <TableCell>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              ACTION_COLORS[action.actionType] || ACTION_COLORS.OTHER
                            }`}
                          >
                            {action.actionType}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {action.quantityAffected}
                        </TableCell>
                        <TableCell className="font-medium">{action.performedBy}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(action.performedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 break-words">
                          {action.notes || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
