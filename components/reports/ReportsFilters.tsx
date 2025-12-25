"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StyledDatePicker } from "../StyledDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter } from "lucide-react";
import { Label } from "../ui/label";
import type { PeriodType } from "@/lib/reports";

interface FilterOption {
  id: string;
  name: string;
}

interface ReportsFiltersProps {
  developers: FilterOption[];
  agents: FilterOption[];
  purchaseStatuses: FilterOption[];
  selectedDeveloper: string;
  selectedAgent: string;
  selectedPurchaseStatus: string;
  selectedPeriod: PeriodType | "custom";
  startDate: string;
  endDate: string;
  onDeveloperChange: (value: string) => void;
  onAgentChange: (value: string) => void;
  onPurchaseStatusChange: (value: string) => void;
  onPeriodChange: (period: PeriodType | "custom") => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function ReportsFilters({
  developers,
  agents,
  purchaseStatuses,
  selectedDeveloper,
  selectedAgent,
  selectedPurchaseStatus,
  selectedPeriod,
  startDate,
  endDate,
  onDeveloperChange,
  onAgentChange,
  onPurchaseStatusChange,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
}: ReportsFiltersProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <CardTitle>Report Filters</CardTitle>
          </div>

          {/* Quick Period Filters */}
          <div className="flex flex-wrap gap-2">
            {(["today", "week", "month", "quarter", "year"] as const).map(
              (period) => (
                <button
                  key={period}
                  onClick={() => onPeriodChange(period)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    selectedPeriod === period
                      ? "bg-green-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="developer">Developer</Label>
            <Select value={selectedDeveloper} onValueChange={onDeveloperChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select developer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="agent">Agent</Label>
            <Select value={selectedAgent} onValueChange={onAgentChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="purchaseStatus">Purchase Status</Label>
            <Select
              value={selectedPurchaseStatus}
              onValueChange={onPurchaseStatusChange}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {purchaseStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <StyledDatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="Select start date"
              label="From Date"
            />
          </div>
          <div>
            <StyledDatePicker
              value={endDate}
              onChange={onEndDateChange}
              placeholder="Select end date"
              label="To Date"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

