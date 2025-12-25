"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { DealMediaUpload } from "@/components/DealMediaUpload";

export default function DealMediaUploadPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const dealId = params.id as string;

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!dealId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Invalid deal ID</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DealMediaUpload dealId={dealId} onBack={handleBack} />
    </AppLayout>
  );
}
