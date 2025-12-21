"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { DashboardAgent } from "@/components/DashboardAgent";
import { DashboardFinance } from "@/components/DashboardFinance";
import { DashboardCEO } from "@/components/DashboardCEO";

type UserRole = "agent" | "finance" | "ceo" | "admin";

export default function DashboardPage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole") as UserRole;

    if (auth !== "true" || !role) {
      router.push("/login");
    } else if (role === "admin") {
      router.push("/users");
    } else {
      setCurrentRole(role);
      setIsLoading(false);
    }
  }, [router]);

  const renderDashboard = () => {
    if (!currentRole) return null;

    switch (currentRole) {
      case "agent":
        return <DashboardAgent />;
      case "finance":
        return <DashboardFinance />;
      case "ceo":
        return <DashboardCEO />;
      case "admin":
        // Admin role only has access to user management, no dashboard view
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">
              Admin access is limited to user management only.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return <AppLayout>{renderDashboard()}</AppLayout>;
}
