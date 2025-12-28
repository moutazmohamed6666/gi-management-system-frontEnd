"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { DealsList } from "@/components/DealsList";
import { CEODealsList } from "@/components/CEODealsList";

type UserRole = "agent" | "finance" | "ceo" | "admin" | "sales_admin" | "compliance";

export default function DealsPage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole") as UserRole;

    if (auth !== "true" || !role) {
      router.push("/login");
    } else if (role === "sales_admin") {
      router.push("/deals/new");
    } else {
      setCurrentRole(role);
      setIsLoading(false);
    }
  }, [router]);

  const handleViewDeal = (dealId: string) => {
    if (currentRole === "finance") {
      router.push(`/finance/${dealId}`);
    } else if (currentRole === "ceo") {
      setSelectedDealId(dealId);
      router.push(`/deals/ceo/${dealId}`);
    } else if (currentRole === "compliance") {
      router.push(`/deals/compliance/${dealId}`);
    } else {
      router.push(`/deals/${dealId}`);
    }
  };

  const handleNewDeal = () => {
    router.push("/deals/new");
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

  if (!currentRole) return null;

  // CEO gets a special deals view
  if (currentRole === "ceo") {
    return (
      <AppLayout>
        <CEODealsList onViewDeal={handleViewDeal} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DealsList
        role={currentRole}
        onViewDeal={handleViewDeal}
        onNewDeal={handleNewDeal}
      />
    </AppLayout>
  );
}
