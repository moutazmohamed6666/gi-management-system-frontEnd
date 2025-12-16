"use client";

import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";

type UserRole = "agent" | "finance" | "ceo" | "admin";

interface UserData {
  id: string;
  username: string;
  name: string;
  roleName: string;
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

    // Token is already stored by Login component via setAuthToken

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
}
