"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { FinanceReview } from "@/components/FinanceReview";

export default function FinanceReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole");
    
    if (auth !== "true" || role !== "finance") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const dealId = params?.id as string;

  const handleBack = () => {
    router.push("/deals");
  };

  const handleEdit = () => {
    router.push(`/deals/${dealId}`);
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
      <FinanceReview dealId={dealId} onBack={handleBack} onEdit={handleEdit} />
    </AppLayout>
  );
}

