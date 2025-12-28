"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { Reports } from "@/components/Reports";

type UserRole = "agent" | "finance" | "ceo" | "admin" | "sales_admin";

export default function ReportsPage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole") as UserRole;

    if (auth !== "true" || !role) {
      router.push("/login");
    } else if (role === "sales_admin") {
      router.push("/deals/new");
    } else if (role !== "finance" && role !== "ceo" && role !== "admin") {
      router.push("/dashboard");
    } else {
      setCurrentRole(role);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Reports />
    </AppLayout>
  );
}

