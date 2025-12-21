// Users API Types and Utilities

import { apiClient } from "./api";

// ============================================================================
// Type Definitions
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  roleId?: string;
  roleName?: string;
  role?: string; // For backward compatibility
  defaultCommissionTypeId?: string;
  defaultCommissionValue?: number;
  managerId?: string;
  manager?: string; // For display purposes
  status?: string;
  createdAt?: string;
  createdDate?: string; // For backward compatibility
  updatedAt?: string;
}

export interface GetUsersParams {
  search?: string;
  role?: string;
  roleId?: string;
  page?: number;
  page_size?: number;
}

export interface GetUsersResponse {
  data: User[];
  total?: number;
  page?: number;
  page_size?: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  roleId: string;
  defaultCommissionTypeId?: string;
  defaultCommissionValue?: number;
  managerId?: string;
  manager?: string; // For backward compatibility
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  name?: string;
  password?: string;
  roleId?: string;
  defaultCommissionTypeId?: string;
  defaultCommissionValue?: number;
  managerId?: string;
  manager?: string; // For backward compatibility
  status?: string;
}

export interface UserResponse {
  data: User;
}

// ============================================================================
// API Functions
// ============================================================================

export const usersApi = {
  /**
   * Get all users with search and filters
   * GET /api/users
   */
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.role) {
      queryParams.append("role", params.role);
    }
    if (params?.roleId) {
      queryParams.append("roleId", params.roleId);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append("page_size", params.page_size.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/users${queryString ? `?${queryString}` : ""}`;

    return apiClient<GetUsersResponse>(endpoint);
  },

  /**
   * Get user by ID
   * GET /api/users/{id}
   */
  getUserById: async (id: string): Promise<UserResponse> => {
    return apiClient<UserResponse>(`/api/users/${id}`);
  },

  /**
   * Create a new user
   * POST /api/users
   */
  createUser: async (userData: CreateUserRequest): Promise<UserResponse> => {
    return apiClient<UserResponse>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user
   * PATCH /api/users/{id}
   */
  updateUser: async (
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> => {
    return apiClient<UserResponse>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete user
   * DELETE /api/users/{id}
   */
  deleteUser: async (id: string): Promise<void> => {
    return apiClient<void>(`/api/users/${id}`, {
      method: "DELETE",
    });
  },
};
