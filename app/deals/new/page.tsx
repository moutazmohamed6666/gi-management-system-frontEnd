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
    if (auth !== "true") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

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
      <DealForm dealId={null} onBack={handleBack} onSave={handleSave} />
    </AppLayout>
  );
}

