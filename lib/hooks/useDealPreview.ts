"use client";

import { useMemo } from "react";
import { DealFormData } from "./useDealFormData";
import { FilterOption } from "../filters";

interface UseDealPreviewProps {
  pendingFormData: DealFormData | null;
  defaultStatusId: string;
  developers: FilterOption[];
  filteredProjects: FilterOption[];
  dealTypes: FilterOption[];
  statuses: FilterOption[];
  purchaseStatuses: FilterOption[];
  propertyTypes: FilterOption[];
  unitTypes: FilterOption[];
  bedrooms: FilterOption[];
  commissionTypes: FilterOption[];
  allAgents: FilterOption[];
}

export function useDealPreview({
  pendingFormData,
  defaultStatusId,
  developers,
  filteredProjects,
  dealTypes,
  statuses,
  purchaseStatuses,
  propertyTypes,
  unitTypes,
  bedrooms,
  commissionTypes,
  allAgents,
}: UseDealPreviewProps) {
  const previewData = useMemo(() => {
    if (!pendingFormData) return null;

    const getDeveloperName = () => {
      const dev = developers.find((d) => d.id === pendingFormData.developerId);
      return dev?.name || "N/A";
    };

    const getProjectName = () => {
      const proj = filteredProjects.find(
        (p) => p.id === pendingFormData.projectId
      );
      return proj?.name || "N/A";
    };

    const getDealTypeName = () => {
      const type = dealTypes.find((t) => t.id === pendingFormData.dealTypeId);
      return type?.name || "N/A";
    };

    const getStatusName = () => {
      const status = statuses.find(
        (s) => s.id === (pendingFormData.statusId || defaultStatusId)
      );
      return status?.name || "N/A";
    };

    const getPurchaseStatusName = () => {
      const status = purchaseStatuses.find(
        (s) => s.id === pendingFormData.purchaseStatusId
      );
      return status?.name || "N/A";
    };

    const getPropertyTypeName = () => {
      const type = propertyTypes.find(
        (t) => t.id === pendingFormData.propertyTypeId
      );
      return type?.name || "N/A";
    };

    const getUnitTypeName = () => {
      const type = unitTypes.find((t) => t.id === pendingFormData.unitTypeId);
      return type?.name || "N/A";
    };

    const getBedroomsName = () => {
      const bedroom = bedrooms.find((b) => b.id === pendingFormData.bedroomId);
      return bedroom?.name || "N/A";
    };

    const getDealCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.totalCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAgentCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.agentCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAdditionalAgentCommissionTypeName = () => {
      const type = commissionTypes.find(
        (t) => t.id === pendingFormData.agencyCommissionTypeId
      );
      return type?.name || "N/A";
    };

    const getAdditionalAgentName = () => {
      if (pendingFormData.additionalAgentType === "internal") {
        const agent = allAgents.find(
          (a) => a.id === pendingFormData.additionalAgentId
        );
        return agent?.name || "N/A";
      }
      return pendingFormData.agencyName || "N/A";
    };

    const getMainAgentName = () => {
      return sessionStorage.getItem("username") || "Current Agent";
    };

    return {
      bookingDate: pendingFormData.bookingDate,
      cfExpiry: pendingFormData.cfExpiry,
      closeDate: pendingFormData.closeDate,
      dealType: getDealTypeName(),
      status: getStatusName(),
      purchaseStatus: getPurchaseStatusName(),
      downpayment: pendingFormData.downpayment,
      developer: getDeveloperName(),
      project: getProjectName(),
      propertyName: pendingFormData.propertyName,
      propertyType: getPropertyTypeName(),
      unitNumber: pendingFormData.unitNumber,
      unitType: getUnitTypeName(),
      size: pendingFormData.size,
      bedrooms: getBedroomsName(),
      buyerName: pendingFormData.buyerName,
      buyerPhone: pendingFormData.buyerPhone,
      buyerEmail: pendingFormData.buyerEmail,
      sellerName: pendingFormData.sellerName,
      sellerPhone: pendingFormData.sellerPhone,
      sellerEmail: pendingFormData.sellerEmail,
      salesValue: pendingFormData.salesValue,

      // Deal Commission
      dealCommissionRate: pendingFormData.totalCommissionValue || "N/A",
      dealCommissionType: getDealCommissionTypeName(),
      totalDealCommission: pendingFormData.totalCommissionValue,

      // Main Agent Commission
      mainAgentName: getMainAgentName(),
      mainAgentCommissionRate: pendingFormData.commRate,
      mainAgentCommissionType: getAgentCommissionTypeName(),
      mainAgentCommissionValue: pendingFormData.commRate,

      // Additional Agent
      hasAdditionalAgent: pendingFormData.hasAdditionalAgent,
      additionalAgentType: pendingFormData.additionalAgentType,
      additionalAgentName: getAdditionalAgentName(),
      additionalAgentCommissionRate: pendingFormData.agencyComm,
      additionalAgentCommissionType: getAdditionalAgentCommissionTypeName(),
      additionalAgentCommissionValue: pendingFormData.agencyComm,
    };
  }, [
    pendingFormData,
    defaultStatusId,
    developers,
    filteredProjects,
    dealTypes,
    statuses,
    purchaseStatuses,
    propertyTypes,
    unitTypes,
    bedrooms,
    commissionTypes,
    allAgents,
  ]);

  return previewData;
}

