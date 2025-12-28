"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { UserManagement } from "@/components/UserManagement";

export default function UsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole");

    if (auth !== "true") {
      router.push("/login");
    } else if (role === "sales_admin") {
      router.push("/deals/new");
    } else if (role !== "admin") {
      router.push("/dashboard");
    } else {
      setTimeout(() => setIsLoading(false), 0);
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
      <UserManagement />
    </AppLayout>
  );
}
