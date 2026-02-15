import type { Deal } from "@/lib/deals";
import type { DealApiResponse } from "./types";

export const getStatusName = (
  deal: Deal | DealApiResponse,
  statuses: Array<{ id: string; name: string }>
): string => {
  const dealApi = deal as DealApiResponse;
  // Prefer status object name, fallback to statusId lookup, then "Unknown"
  if (dealApi.status?.name) {
    return dealApi.status.name;
  }
  if (deal.statusId) {
    const status = statuses.find((s) => s.id === deal.statusId);
    return status?.name || deal.statusId;
  }
  return "Unknown";
};

export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("closed") || statusLower.includes("paid")) {
    return "bg-green-600";
  }
  if (
    statusLower.includes("transferred") ||
    statusLower.includes("received") ||
    statusLower.includes("approved")
  ) {
    return "bg-blue-600";
  }
  if (statusLower.includes("finance") || statusLower.includes("partially")) {
    return "bg-orange-600";
  }
  if (statusLower.includes("submitted")) {
    return "bg-yellow-600";
  }
  return "bg-gray-600";
};

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDealValue = (deal: Deal | DealApiResponse): string => {
  const dealApi = deal as DealApiResponse;
  const value =
    typeof dealApi.dealValue === "number"
      ? dealApi.dealValue
      : typeof deal.dealValue === "string"
      ? parseFloat(deal.dealValue)
      : 0;
  return `AED ${value.toLocaleString()}`;
};

