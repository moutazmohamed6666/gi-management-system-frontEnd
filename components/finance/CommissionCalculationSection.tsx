"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
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

interface CommissionCalculationSectionProps {
  financeData: FinanceData;
  onChange: (field: string, value: string | number | boolean) => void;
}

export function CommissionCalculationSection({
  financeData,
  onChange,
}: CommissionCalculationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Calculation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fixedCommission">Fixed Commission (AED)</Label>
            <Input
              id="fixedCommission"
              type="number"
              value={financeData.fixedCommission}
              onChange={(e) =>
                onChange("fixedCommission", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="totalCommission">Total Commission (AED)</Label>
            <Input
              id="totalCommission"
              type="number"
              value={financeData.totalCommission}
              onChange={(e) =>
                onChange("totalCommission", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="buyerRepCommission">
              Buyer Rep Commission (AED)
            </Label>
            <Input
              id="buyerRepCommission"
              type="number"
              value={financeData.buyerRepCommission}
              onChange={(e) =>
                onChange("buyerRepCommission", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label htmlFor="sellerRepCommission">
              Seller Rep Commission (AED)
            </Label>
            <Input
              id="sellerRepCommission"
              type="number"
              value={financeData.sellerRepCommission}
              onChange={(e) =>
                onChange(
                  "sellerRepCommission",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
          <div>
            <Label htmlFor="managerCommission">
              Manager Commission (AED)
            </Label>
            <Input
              id="managerCommission"
              type="number"
              value={financeData.managerCommission}
              onChange={(e) =>
                onChange("managerCommission", parseFloat(e.target.value) || 0)
              }
              className="bg-blue-50 dark:bg-blue-900/20"
            />
          </div>
          <div>
            <Label htmlFor="agentCommission">Agent Commission (AED)</Label>
            <Input
              id="agentCommission"
              type="number"
              value={financeData.agentCommission}
              onChange={(e) =>
                onChange("agentCommission", parseFloat(e.target.value) || 0)
              }
              className="bg-green-50 dark:bg-green-900/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

