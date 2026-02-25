"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Alert {
  _id: string;
  batchId: {
    productId: {
      name: string;
    };
    expiryDate: string;
    quantityAvailable: number;
  };
  alertType: string;
  alertDate: string;
}

interface AcknowledgeAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: Alert | null;
  onSubmit: (staffName: string) => Promise<void>;
  isLoading: boolean;
}

export default function AcknowledgeAlertDialog({
  open,
  onOpenChange,
  alert,
  onSubmit,
  isLoading,
}: AcknowledgeAlertDialogProps) {
  const [staffName, setStaffName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;
    await onSubmit(staffName);
    setStaffName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Acknowledge Alert</DialogTitle>
          <DialogDescription>
            Confirm that you&apos;ve acknowledged this expiry alert
          </DialogDescription>
        </DialogHeader>

        {alert && (
          <div className="space-y-4">
            {/* Alert Info */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold">{alert.batchId.productId.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Alert Type</p>
                  <p className="font-semibold">{alert.alertType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Qty</p>
                  <p className="font-semibold">{alert.batchId.quantityAvailable}</p>
                </div>
              </div>
            </div>

            {/* Staff Name Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Your Name</Label>
                <Input
                  id="staffName"
                  placeholder="Enter your name"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !staffName.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isLoading ? "Acknowledging..." : "Acknowledge"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
