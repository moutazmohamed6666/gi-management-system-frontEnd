"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar, X } from "lucide-react";

interface CompactDateRangeFilterProps {
  onDateChange: (startDate: string, endDate: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function CompactDateRangeFilter({ 
  onDateChange, 
  startDate, 
  endDate,
  onStartDateChange,
  onEndDateChange 
}: CompactDateRangeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<"today" | "week" | "month" | "quarter" | "year" | "custom" | null>("today");

  // Set today as default on mount
  useEffect(() => {
    if (!startDate && !endDate) {
      handleQuickFilter("today");
    }
  }, []);

  const handleClearFilter = () => {
    onStartDateChange("");
    onEndDateChange("");
    setActiveFilter(null);
    onDateChange("", "");
  };

  // Quick filter options
  const handleQuickFilter = (type: "today" | "week" | "month" | "quarter" | "year") => {
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
      case "quarter":
        start.setMonth(today.getMonth() - 3);
        break;
      case "year":
        start.setFullYear(today.getFullYear() - 1);
        break;
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    onStartDateChange(startStr);
    onEndDateChange(endStr);
    setActiveFilter(type);
    onDateChange(startStr, endStr);
  };

  const handleManualDateChange = () => {
    if (startDate && endDate) {
      setActiveFilter("custom");
      onDateChange(startDate, endDate);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickFilter("today")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "today"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handleQuickFilter("week")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "week"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => handleQuickFilter("month")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "month"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => handleQuickFilter("quarter")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "quarter"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Quarter
        </button>
        <button
          onClick={() => handleQuickFilter("year")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "year"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Year
        </button>
        {activeFilter && (
          <button
            onClick={handleClearFilter}
            className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
            title="Clear filter"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filter Display */}
      {activeFilter && (
        <div className="text-xs text-gray-600 flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>
            {startDate && endDate && (
              <>
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' - '}
                {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

