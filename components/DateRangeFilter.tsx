"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { StyledDatePicker } from "./StyledDatePicker";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  onDateChange: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}

export function DateRangeFilter({
  onDateChange,
  startDate: propStartDate = "",
  endDate: propEndDate = "",
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(propStartDate);
  const [endDate, setEndDate] = useState(propEndDate);
  const [activeFilter, setActiveFilter] = useState<
    "today" | "week" | "month" | "year" | "custom" | null
  >(null);
  const prevPropsRef = useRef({ propStartDate, propEndDate });

  // Sync with props when they change from parent (external changes)
  // This is a valid pattern for syncing props to state when parent updates
  useEffect(() => {
    const prevProps = prevPropsRef.current;
    // Only update if props changed from previous values (external change from parent)
    if (prevProps.propStartDate !== propStartDate) {
      setStartDate(propStartDate);
    }
    if (prevProps.propEndDate !== propEndDate) {
      setEndDate(propEndDate);
    }
    prevPropsRef.current = { propStartDate, propEndDate };
  }, [propStartDate, propEndDate]);

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setActiveFilter(null);
    onDateChange("", "");
  };

  const handleApplyFilter = () => {
    if (startDate || endDate) {
      setActiveFilter("custom");
      onDateChange(startDate, endDate);
    }
  };

  // Quick filter options
  const handleQuickFilter = (type: "today" | "week" | "month" | "year") => {
    const today = new Date();
    let start = new Date();
    const end = today;

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

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    setStartDate(startStr);
    setEndDate(endStr);
    setActiveFilter(type);
    onDateChange(startStr, endStr);
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Date Range Label + Preset Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
            Date Range Filter
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Button
            variant={activeFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("today")}
            className={
              activeFilter === "today"
                ? "gi-bg-dark-green dark:bg-[(--gi-green-80)] text-white h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            }
          >
            Today
          </Button>
          <Button
            variant={activeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("week")}
            className={
              activeFilter === "week"
                ? "gi-bg-dark-green dark:bg-[(--gi-green-80)] text-white h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            }
          >
            <span className="hidden xs:inline">Last </span>7 Days
          </Button>
          <Button
            variant={activeFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("month")}
            className={
              activeFilter === "month"
                ? "gi-bg-dark-green dark:bg-[(--gi-green-80)] text-white h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            }
          >
            <span className="hidden xs:inline">Last </span>Month
          </Button>
          <Button
            variant={activeFilter === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("year")}
            className={
              activeFilter === "year"
                ? "gi-bg-dark-green dark:bg-[(--gi-green-80)] text-white h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            }
          >
            <span className="hidden xs:inline">Last </span>Year
          </Button>
        </div>
      </div>

      {/* Row 2: Date Inputs + Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-1.5">
            Start Date
          </label>
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
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-1.5">
            End Date
          </label>
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
            className="w-full gi-bg-dark-green dark:bg-[(--gi-green-80)] h-[34px] sm:h-[38px] text-white text-xs sm:text-sm"
            disabled={!startDate && !endDate}
          >
            Apply
          </Button>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearFilter}
            className="w-full h-[34px] sm:h-[38px] dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-xs sm:text-sm"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
