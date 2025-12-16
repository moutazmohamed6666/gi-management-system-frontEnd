"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface StyledDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

// Helper function to format date
function formatDate(date: Date): string {
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
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Helper function to convert Date to YYYY-MM-DD string
function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function StyledDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  id,
}: StyledDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dateValue = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = dateToString(date);
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-[42px] border-gray-300 dark:border-gray-600 hover:border-[(--gi-dark-green)] dark:hover:border-[(--gi-green-80)] transition-colors dark:bg-gray-700 dark:text-gray-200",
              !dateValue && "text-gray-500 dark:text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            {dateValue ? (
              <span className="text-gray-900 dark:text-gray-100">
                {formatDate(dateValue)}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white dark:bg-gray-800 dark:border-gray-700"
          align="start"
        >
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            initialFocus
            className="rounded-md border dark:border-gray-700"
            classNames={{
              months: "flex flex-col sm:flex-row gap-2",
              month: "flex flex-col gap-4",
              caption: "flex justify-center pt-1 relative items-center w-full",
              caption_label:
                "text-sm gi-text-dark-green dark:text-[(--gi-green-80)]",
              nav: "flex items-center gap-1",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-gray-600 dark:text-gray-400 rounded-md w-9 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: cn(
                "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
              ),
              day_selected:
                "gi-bg-dark-green dark:bg-[(--gi-green-80)] text-white hover:gi-bg-dark-green dark:hover:bg-[(--gi-green-80)] hover:text-white focus:gi-bg-dark-green dark:focus:bg-[(--gi-green-80)] focus:text-white",
              day_today:
                "bg-[(--gi-green-20)] dark:bg-[(--gi-green-80)]/20 text-[(--gi-dark-green)] dark:text-[(--gi-green-80)] font-medium border border-[(--gi-dark-green)] dark:border-[(--gi-green-80)]",
              day_outside: "text-gray-400 dark:text-gray-600 opacity-50",
              day_disabled: "text-gray-300 dark:text-gray-700 opacity-50",
              day_range_middle:
                "aria-selected:bg-[(--gi-green-20)] dark:aria-selected:bg-[(--gi-green-80)]/20",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
