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
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { 
  useGetAllAlertsQuery, 
  useAcknowledgeAlertMutation,
  useGetOpenAlertsQuery 
} from "@/redux/appData";
import { toast } from "sonner";
import CustomLoader from "@/components/local/CustomLoader";
import PaginationComponent from "@/components/local/PaginationComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AcknowledgeAlertDialog from "./components/AcknowledgeAlertDialog";

interface Alert {
  _id: string;
  batchId: {
    _id: string;
    productId: {
      name: string;
    };
    expiryDate: string;
    quantityAvailable: number;
    status: string;
  };
  ruleId?: {
    _id: string;
    ruleName: string;
    daysBeforeExpiry: number;
  };
  alertType: string;
  alertDate: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export default function AlertsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState("open");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [acknowledgeAlert, { isLoading: isAcknowledging }] = useAcknowledgeAlertMutation();

  // Fetch open alerts
  const { data: openAlertsData, isLoading: openLoading, refetch: refetchOpen } = useGetOpenAlertsQuery({});

  // Fetch all alerts
  const { data: allAlertsData, isLoading: allLoading, refetch: refetchAll } = useGetAllAlertsQuery(
    { page, limit },
    { refetchOnMountOrArgChange: true }
  );

  const openAlerts: Alert[] = openAlertsData?.alerts || [];
  const allAlerts: Alert[] = allAlertsData?.alerts || [];
  const total = allAlertsData?.total || 0;
  const pages = allAlertsData?.pages || 1;

  const handleAcknowledge = async (alert: Alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const onAcknowledgeSubmit = async (staffName: string) => {
    if (!selectedAlert) return;
    try {
      await acknowledgeAlert({
        alertId: selectedAlert._id,
        acknowledgedBy: staffName,
      }).unwrap();

      toast.success("Alert acknowledged successfully!");
      setDialogOpen(false);
      refetchOpen();
      refetchAll();
    } catch (error: unknown) {
      interface ErrorResponse {
        data?: { message?: string };
      }
      const err = error as ErrorResponse;
      const errorMessage = err?.data?.message || "Failed to acknowledge alert";
      toast.error(errorMessage);
    }
  };

  const AlertsTable = ({ alerts, isLoading }: { alerts: Alert[]; isLoading: boolean }) => {
    if (isLoading) return <CustomLoader />;
    if (alerts.length === 0) {
      return (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">
            {activeTab === "open" ? "No open alerts. All clear!" : "No alerts found."}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>List of product expiry alerts</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Product</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-center">Available Qty</TableHead>
                <TableHead>Alert Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert._id} className="hover:bg-gray-50">
                  <TableCell className="font-semibold">
                    {alert.batchId.productId.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {alert.alertType}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(alert.batchId.expiryDate)}</TableCell>
                  <TableCell className="text-center font-semibold">
                    {alert.batchId.quantityAvailable}
                  </TableCell>
                  <TableCell>{formatDate(alert.alertDate)}</TableCell>
                  <TableCell>
                    {alert.acknowledged ? (
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledged
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          By: {alert.acknowledgedBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          {alert.acknowledgedAt && formatDate(alert.acknowledgedAt)}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Open
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Alert Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product expiry alerts</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Open Alerts</p>
          <p className="text-3xl font-bold text-red-600">{openAlerts.length}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Open Alerts</p>
          <p className="text-2xl font-bold text-gray-800">
            {openAlerts.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Acknowledged Today</p>
          <p className="text-2xl font-bold text-gray-800">
            {allAlerts.filter((a) => {
              if (!a.acknowledged || !a.acknowledgedAt) return false;
              const today = new Date().toDateString();
              return new Date(a.acknowledgedAt).toDateString() === today;
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border-b">
          <TabsTrigger value="open" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Open Alerts ({openAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            All Alerts ({total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          <AlertsTable alerts={openAlerts} isLoading={openLoading} />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <AlertsTable alerts={allAlerts} isLoading={allLoading} />
          {allAlerts.length > 0 && (
            <div className="mt-6">
              <PaginationComponent
                currentPage={page}
                totalPages={pages}
                handleNextPage={() => setPage(prev => Math.min(prev + 1, pages))}
                handlePrevPage={() => setPage(prev => Math.max(prev - 1, 1))}
                onPageChange={setPage}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <AcknowledgeAlertDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        alert={selectedAlert}
        onSubmit={onAcknowledgeSubmit}
        isLoading={isAcknowledging}
      />
    </div>
  );
}
