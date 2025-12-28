"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { ComplianceDealView } from "@/components/ComplianceDealView";

export default function ComplianceDealViewPage() {
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
    } else if (role !== "compliance") {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const dealId = params?.id as string;

  const handleBack = () => {
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
      <ComplianceDealView dealId={dealId} onBack={handleBack} />
    </AppLayout>
  );
}

