"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface FinanceData {
  fixedCommission: number;
  buyerRepCommission: number;
  sellerRepCommission: number;
  managerCommission: number;
  agentCommission: number;
  totalCommission: number;
  receivedAmount: number;
  receivedPercentage: number;
  paidToAgent: boolean;
  paidPercentage: number;
  paidDate: string;
  remainingAmount: number;
  commissionStatus: "Pending" | "Partially Paid" | "Paid";
  financeNotes: string;
}

interface PaymentTrackingSectionProps {
  financeData: FinanceData;
  onChange: (field: string, value: string | number | boolean) => void;
}

export function PaymentTrackingSection({
  financeData,
  onChange,
}: PaymentTrackingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="receivedAmount">Received Amount (AED)</Label>
            <Input
              id="receivedAmount"
              type="number"
              value={financeData.receivedAmount}
              onChange={(e) =>
                onChange("receivedAmount", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="receivedPercentage">Received %</Label>
            <Input
              id="receivedPercentage"
              type="number"
              value={financeData.receivedPercentage}
              onChange={(e) =>
                onChange("receivedPercentage", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="paidToAgent">Paid to Agent</Label>
            <select
              id="paidToAgent"
              value={financeData.paidToAgent ? "yes" : "no"}
              onChange={(e) =>
                onChange("paidToAgent", e.target.value === "yes")
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <Label htmlFor="paidPercentage">Paid %</Label>
            <Input
              id="paidPercentage"
              type="number"
              value={financeData.paidPercentage}
              onChange={(e) =>
                onChange("paidPercentage", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="paidDate">Paid Date</Label>
            <Input
              id="paidDate"
              type="date"
              value={financeData.paidDate}
              onChange={(e) => onChange("paidDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="remainingAmount">Remaining Amount (AED)</Label>
            <Input
              id="remainingAmount"
              type="number"
              value={financeData.remainingAmount}
              onChange={(e) =>
                onChange("remainingAmount", parseFloat(e.target.value) || 0)
              }
              className="bg-orange-50 dark:bg-orange-900/20"
            />
          </div>
          <div>
            <Label htmlFor="commissionStatus">Commission Status</Label>
            <select
              id="commissionStatus"
              value={financeData.commissionStatus}
              onChange={(e) => onChange("commissionStatus", e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="financeNotes">Finance Notes</Label>
          <Textarea
            id="financeNotes"
            value={financeData.financeNotes}
            onChange={(e) => onChange("financeNotes", e.target.value)}
            placeholder="Enter finance notes..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}

