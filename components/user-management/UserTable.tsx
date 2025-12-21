"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, Edit, Trash2 } from "lucide-react";
import type { User } from "@/lib/users";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  getRoleBadgeColor: (role: string | undefined) => string;
  getRoleDisplayName: (user: User) => string;
  formatDate: (dateString?: string) => string;
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  getRoleBadgeColor,
  getRoleDisplayName,
  formatDate,
}: UserTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading users...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>0 Users Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No users found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{users.length} Users Found</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-white ${getRoleBadgeColor(
                        user.role || user.roleName
                      )}`}
                    >
                      {getRoleDisplayName(user).charAt(0).toUpperCase() +
                        getRoleDisplayName(user).slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-white ${
                        user.status === "Active"
                          ? "bg-green-600 dark:bg-green-500"
                          : "bg-red-600 dark:bg-red-500"
                      }`}
                    >
                      {user.status || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {formatDate(user.createdAt || user.createdDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit(user);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(user);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
