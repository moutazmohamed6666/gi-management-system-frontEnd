"use client";

import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";

type UserRole =
  | "agent"
  | "finance"
  | "ceo"
  | "admin"
  | "SALES_ADMIN"
  | "compliance";

interface UserData {
  id: string;
  username: string;
  name: string;
  roleName: string;
  commissionType?:
    | {
        id: string;
        name: string;
      }
    | string
    | null;
  commissionValue?: number | null;
}

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (
    role: UserRole,
    username: string,
    token: string,
    userData: UserData
  ) => {
    // Store user info in sessionStorage
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("userId", userData.id || "");
    sessionStorage.setItem("userRoleName", userData.roleName || "");

    // Store commission defaults
    // Handle commissionType - could be an object with id or a string ID
    let commissionTypeId: string | null = null;
    if (userData.commissionType) {
      if (typeof userData.commissionType === "string") {
        commissionTypeId = userData.commissionType;
      } else if (
        typeof userData.commissionType === "object" &&
        userData.commissionType !== null &&
        "id" in userData.commissionType
      ) {
        commissionTypeId = userData.commissionType.id;
      }
    }

    if (commissionTypeId) {
      sessionStorage.setItem("userCommissionType", commissionTypeId);
    } else {
      sessionStorage.removeItem("userCommissionType");
    }

    // Token is already stored by Login component via setAuthToken

    // Redirect based on role
    if (role === "admin") {
      router.push("/users");
    } else if (role === "SALES_ADMIN") {
      router.push("/dashboard");
    } else if (role === "compliance") {
      router.push("/deals");
    } else {
      router.push("/dashboard");
    }
  };

  return <Login onLogin={handleLogin} />;
}
