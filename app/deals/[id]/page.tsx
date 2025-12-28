"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { DealForm } from "@/components/DealForm";

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole");

    if (auth !== "true") {
      router.push("/login");
    } else if (role === "sales_admin") {
      router.push("/deals/new");
    } else if (role === "compliance") {
      // COMPLIANCE has their own dedicated view, redirect them there
      router.push(`/deals/compliance/${params?.id}`);
    } else {
      setIsLoading(false);
    }
  }, [router, params?.id]);

  const dealId = params?.id as string;

  const handleBack = () => {
    router.push("/deals");
  };

  const handleSave = () => {
    router.push("/deals");
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
      <DealForm dealId={dealId} onBack={handleBack} onSave={handleSave} />
    </AppLayout>
  );
}

