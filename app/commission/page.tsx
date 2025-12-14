"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { CommissionEngine } from "@/components/CommissionEngine";

export default function CommissionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole");
    
    if (auth !== "true" || role !== "admin") {
      router.push("/login");
    } else {
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
      <CommissionEngine />
    </AppLayout>
  );
}

