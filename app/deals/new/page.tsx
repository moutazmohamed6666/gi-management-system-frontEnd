"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { DealForm } from "@/components/DealForm";

export default function NewDealPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole");
    if (auth !== "true") {
      router.push("/login");
    } else if (role === "compliance") {
      router.push("/deals");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleBack = () => {
    router.push("/deals");
  };

  const handleSave = (createdDealId?: string) => {
    if (createdDealId) {
      // Navigate to media upload page for the newly created deal
      router.push(`/deals/${createdDealId}/media`);
    } else {
      // Fallback to deals list if no ID provided (shouldn't happen for new deals)
      router.push("/deals");
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

  return (
    <AppLayout>
      <DealForm dealId={null} onBack={handleBack} onSave={handleSave} />
    </AppLayout>
  );
}

