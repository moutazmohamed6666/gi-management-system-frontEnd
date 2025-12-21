"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="user-search-input"
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onSearchChange(e.target.value);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          >
            <option value="all">All Roles</option>
            <option value="agent">Agent</option>
            <option value="finance">Finance Team</option>
            <option value="ceo">CEO / Management</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
