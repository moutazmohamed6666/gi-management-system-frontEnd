"use client";

import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";

type UserRole = "agent" | "finance" | "ceo" | "admin";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: UserRole, username: string) => {
    // Store user info in sessionStorage (in production, use proper auth)
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("isAuthenticated", "true");

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
}
