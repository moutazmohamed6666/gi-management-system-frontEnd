"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { useFilters } from "@/lib/useFilters";

interface UserFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  roleId: string;
  defaultCommissionTypeId: string;
  defaultCommissionValue: number;
  manager: string;
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateUserModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateUserModalProps) {
  const { roles, commissionTypes, isLoading: filtersLoading } = useFilters();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      roleId: "",
      defaultCommissionTypeId: "",
      defaultCommissionValue: 0,
      manager: "",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        email: "",
        username: "",
        password: "",
        roleId: "",
        defaultCommissionTypeId: "",
        defaultCommissionValue: 0,
        manager: "",
      });
    }
  }, [open, reset]);

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const onSubmitForm = async (data: UserFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-name">Full Name *</Label>
                <Input
                  id="create-name"
                  placeholder="Enter full name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="create-email">Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="create-username">Username *</Label>
                <Input
                  id="create-username"
                  placeholder="Enter username"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="create-roleId">Role *</Label>
                <select
                  id="create-roleId"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  {...register("roleId", { required: "Role is required" })}
                  disabled={filtersLoading}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="text-sm text-red-600 mt-1">{errors.roleId.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="create-defaultCommissionTypeId">
                  Default Commission Type *
                </Label>
                <select
                  id="create-defaultCommissionTypeId"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  {...register("defaultCommissionTypeId", {
                    required: "Commission type is required",
                  })}
                  disabled={filtersLoading}
                >
                  <option value="">Select commission type</option>
                  {commissionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.defaultCommissionTypeId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.defaultCommissionTypeId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="create-defaultCommissionValue">
                  Default Commission Value *
                </Label>
                <Input
                  id="create-defaultCommissionValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("defaultCommissionValue", {
                    required: "Commission value is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Commission value must be greater than or equal to 0",
                    },
                  })}
                />
                {errors.defaultCommissionValue && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.defaultCommissionValue.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="create-manager">Manager (Optional)</Label>
                <Input
                  id="create-manager"
                  placeholder="Enter manager name"
                  {...register("manager")}
                />
              </div>
              <div>
                <Label htmlFor="create-password">Temporary Password *</Label>
                <Input
                  id="create-password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
