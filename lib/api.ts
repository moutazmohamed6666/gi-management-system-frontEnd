// API Configuration and Client Utilities

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev.shaheen-env.work";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    roleName: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

// Get stored token from sessionStorage
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("authToken");
};

// Store token in sessionStorage
export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("authToken", token);
};

// Remove token from sessionStorage
export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("authToken");
};

// Extended options for apiClient
interface ApiClientOptions extends RequestInit {
  responseType?: "json" | "blob";
}

// API Client with authentication
export const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> => {
  const { responseType = "json", ...fetchOptions } = options;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(responseType === "json" ? { "Content-Type": "application/json" } : {}),
    Accept: responseType === "blob" ? "*/*" : "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          JSON.stringify(errorData);
      } catch {
        try {
          const textBody = await response.text();
          if (textBody) {
            errorMessage = textBody;
          }
        } catch {
          // keep the default HTTP status message
        }
      }
      throw {
        message: errorMessage,
        status: response.status,
      } as ApiError;
    }

    if (responseType === "blob") {
      return (await response.blob()) as T;
    }

    return await response.json();
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    throw {
      message:
        error instanceof Error
          ? error.message
          : "Network error or server unavailable",
      status: 0,
    } as ApiError;
  }
};

// Extract error message from any thrown value (Error, ApiError plain object, string, etc.)
export const getErrorMessage = (
  error: unknown,
  fallback: string = "An unexpected error occurred",
): string => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === "string") return error;
  return fallback;
};

// Auth API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};
