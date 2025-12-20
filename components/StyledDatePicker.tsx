"use client";

import { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./ui/utils";

interface StyledDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

// Helper function to format date
function formatDate(date: Date | DateObject): string {
  const dateObj = date instanceof DateObject ? date.toDate() : date;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

// Helper function to convert Date to YYYY-MM-DD string
function dateToString(date: Date | DateObject): string {
  const dateObj = date instanceof DateObject ? date.toDate() : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function StyledDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  id,
}: StyledDatePickerProps) {
  const [dateValue, setDateValue] = useState<Value>(null);

  // Sync value prop to internal state
  useEffect(() => {
    if (value) {
      setDateValue(new DateObject(value));
    } else {
      setDateValue(null);
    }
  }, [value]);

  const handleChange = (date: DateObject | null) => {
    setDateValue(date);
    if (date) {
      const formattedDate = dateToString(date);
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  const displayValue = dateValue
    ? formatDate(dateValue as DateObject)
    : placeholder;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}
      <DatePicker
        value={dateValue}
        onChange={(date) => {
          if (date && !Array.isArray(date)) {
            handleChange(date as DateObject);
          } else if (date === null || date === undefined) {
            handleChange(null);
          }
        }}
        format="DD MMM YYYY"
        containerClassName="w-full"
        calendarPosition="bottom-start"
        className="theme-date-picker"
        render={(value, openCalendar) => {
          return (
            <div
              className={cn(
                "w-full h-[42px] px-3 py-2 text-sm rounded-md border",
                "border-border bg-background text-foreground",
                "hover:border-ring focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "transition-colors cursor-pointer flex items-center gap-2",
                !dateValue && "text-muted-foreground"
              )}
              onClick={openCalendar}
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-left">{displayValue}</span>
            </div>
          );
        }}
      />
    </div>
  );
}
