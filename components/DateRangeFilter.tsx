"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { StyledDatePicker } from "./StyledDatePicker";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ onDateChange }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState<"today" | "week" | "month" | "year" | "custom" | null>(null);

  const handleApplyFilter = () => {
    if (startDate || endDate) {
      setActiveFilter("custom");
      onDateChange(startDate, endDate);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
    onDateChange("", "");
  };

  // Quick filter options
  const handleQuickFilter = (type: "today" | "week" | "month" | "year") => {
    const today = new Date();
    let start = new Date();
    let end = today;

    switch (type) {
      case "today":
        start = today;
        break;
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(today.getFullYear() - 1);
        break;
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    setStartDate(startStr);
    setEndDate(endStr);
    setActiveFilter(type);
    onDateChange(startStr, endStr);
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Date Range Label + Preset Buttons */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Date Range Filter</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("today")}
            className={activeFilter === "today" ? "gi-bg-dark-green dark:bg-[var(--gi-green-80)] text-white h-8" : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-8"}
          >
            Today
          </Button>
          <Button
            variant={activeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("week")}
            className={activeFilter === "week" ? "gi-bg-dark-green dark:bg-[var(--gi-green-80)] text-white h-8" : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-8"}
          >
            Last 7 Days
          </Button>
          <Button
            variant={activeFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("month")}
            className={activeFilter === "month" ? "gi-bg-dark-green dark:bg-[var(--gi-green-80)] text-white h-8" : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-8"}
          >
            Last Month
          </Button>
          <Button
            variant={activeFilter === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("year")}
            className={activeFilter === "year" ? "gi-bg-dark-green dark:bg-[var(--gi-green-80)] text-white h-8" : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-8"}
          >
            Last Year
          </Button>
        </div>
      </div>
      
      {/* Row 2: Date Inputs + Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Start Date</label>
          <StyledDatePicker
            value={startDate}
            onChange={(value) => {
              setStartDate(value);
              setActiveFilter("custom");
            }}
            placeholder="Select start date"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">End Date</label>
          <StyledDatePicker
            value={endDate}
            onChange={(value) => {
              setEndDate(value);
              setActiveFilter("custom");
            }}
            placeholder="Select end date"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleApplyFilter}
            className="w-full gi-bg-dark-green dark:bg-[var(--gi-green-80)] h-[38px] text-white text-sm"
            disabled={!startDate && !endDate}
          >
            Apply Filter
          </Button>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearFilter}
            className="w-full h-[38px] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

