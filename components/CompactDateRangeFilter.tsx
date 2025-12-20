"use client";

import { useState, useEffect } from "react";
import { StyledDatePicker } from "./StyledDatePicker";
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

  // Sync dates to parent when they change
  useEffect(() => {
    if (startDate || endDate) {
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateChange]);

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

  const handleStartDateChange = (date: string) => {
    onStartDateChange(date);
    setActiveFilter("custom");
  };

  const handleEndDateChange = (date: string) => {
    onEndDateChange(date);
    setActiveFilter("custom");
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
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handleQuickFilter("week")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "week"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => handleQuickFilter("month")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "month"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => handleQuickFilter("quarter")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "quarter"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Quarter
        </button>
        <button
          onClick={() => handleQuickFilter("year")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeFilter === "year"
              ? "gi-bg-dark-green text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Year
        </button>
        {activeFilter && (
          <button
            onClick={handleClearFilter}
            className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
            title="Clear filter"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
            Start Date
          </label>
          <StyledDatePicker
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Select start date"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
            End Date
          </label>
          <StyledDatePicker
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="Select end date"
          />
        </div>
      </div>

      {/* Active Filter Display */}
      {activeFilter && startDate && endDate && (
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' - '}
            {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
}
