"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { usersApi, type User } from "@/lib/users";
import { toast } from "sonner";
import { Plus, AlertCircle } from "lucide-react";
import { UserFilters } from "./user-management/UserFilters";
import { UserTable } from "./user-management/UserTable";
import { CreateUserModal } from "./user-management/CreateUserModal";
import { EditUserModal } from "./user-management/EditUserModal";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    username: string;
    password: string;
    roleId: string;
    defaultCommissionTypeId: string;
    defaultCommissionValue: number;
    manager: string;
  } | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: {
          search?: string;
          role?: string;
        } = {};

        if (searchTerm) {
          params.search = searchTerm;
        }
        if (roleFilter !== "all") {
          params.role = roleFilter;
        }

        const response = await usersApi.getUsers(params);
        const usersList = Array.isArray(response.data) ? response.data : [];
        setUsers(usersList);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load users";
        setError(errorMessage);
        toast.error("Error loading users", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(
      () => {
        fetchUsers();
      },
      searchTerm ? 500 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter]);

  const getRoleBadgeColor = (role: string | undefined) => {
    const roleName = role?.toLowerCase() || "";
    switch (roleName) {
      case "agent":
        return "bg-blue-600";
      case "finance":
        return "bg-green-600";
      case "ceo":
        return "bg-purple-600";
      case "admin":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getRoleDisplayName = (user: User) => {
    return user.roleName || user.role || "Unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    roleId: string;
    defaultCommissionTypeId: string;
    defaultCommissionValue: number;
    manager: string;
  }) => {
    setIsSubmitting(true);
    try {
      await usersApi.createUser({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        roleId: data.roleId,
        defaultCommissionTypeId: data.defaultCommissionTypeId || undefined,
        defaultCommissionValue: data.defaultCommissionValue || undefined,
        manager: data.manager || undefined,
      });

      toast.success("User Created", {
        description: "User has been created successfully!",
      });

      setShowCreateModal(false);

      // Refresh users list
      const response = await usersApi.getUsers({
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create user";
      toast.error("Error Creating User", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      username: user.username || "",
      password: "",
      roleId: user.roleId || "",
      defaultCommissionTypeId: user.defaultCommissionTypeId || "",
      defaultCommissionValue: user.defaultCommissionValue || 0,
      manager: user.manager || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    roleId: string;
    defaultCommissionTypeId: string;
    defaultCommissionValue: number;
    manager: string;
  }) => {
    if (!selectedUser) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: {
        name: string;
        email: string;
        roleId?: string;
        defaultCommissionTypeId?: string;
        defaultCommissionValue?: number;
        manager?: string;
        password?: string;
      } = {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
      };

      if (data.defaultCommissionTypeId) {
        updateData.defaultCommissionTypeId = data.defaultCommissionTypeId;
      }

      if (data.defaultCommissionValue !== undefined) {
        updateData.defaultCommissionValue = data.defaultCommissionValue;
      }

      if (data.manager) {
        updateData.manager = data.manager;
      }

      if (data.password) {
        updateData.password = data.password;
      }

      await usersApi.updateUser(selectedUser.id, updateData);

      toast.success("User Updated", {
        description: "User has been updated successfully!",
      });

      setShowEditModal(false);
      setSelectedUser(null);
      setEditFormData(null);

      // Refresh users list
      const response = await usersApi.getUsers({
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      toast.error("Error Updating User", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await usersApi.deleteUser(selectedUser.id);

      toast.success("User Deleted", {
        description: "User has been deleted successfully!",
      });

      setShowDeleteDialog(false);
      setSelectedUser(null);

      // Refresh users list
      const response = await usersApi.getUsers({
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      toast.error("Error Deleting User", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-gray-100">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system users and permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error loading users</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={(user) => {
          setSelectedUser(user);
          setShowDeleteDialog(true);
        }}
        getRoleBadgeColor={getRoleBadgeColor}
        getRoleDisplayName={getRoleDisplayName}
        formatDate={formatDate}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setSelectedUser(null);
            setEditFormData(null);
          }
        }}
        initialData={editFormData || undefined}
        onSubmit={handleUpdateUser}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
        onConfirm={handleDeleteUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
