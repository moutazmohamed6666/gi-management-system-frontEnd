"use client";

import { useLayoutEffect, useState } from "react";
import { UseFormReset } from "react-hook-form";
import { dealsApi, type Deal } from "../deals";
import { getErrorMessage } from "../api";
import { DealFormData } from "./useDealFormData";

interface UseDealLoaderProps {
  dealId: string | null;
  reset: UseFormReset<DealFormData>;
}

export function useDealLoader({ dealId, reset }: UseDealLoaderProps) {
  const [dealError, setDealError] = useState<string | null>(null);
  const [loadedDealId, setLoadedDealId] = useState<string | null>(null);
  const [dealFetchNonce, setDealFetchNonce] = useState(0);
  const [loadedDeal, setLoadedDeal] = useState<Deal | null>(null);

  const isoToYmd = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Load deal when editing
  useLayoutEffect(() => {
    if (!dealId) return;
    if (loadedDealId === dealId) return;

    let cancelled = false;

    dealsApi
      .getDealById(dealId)
      .then((deal: Deal) => {
        if (cancelled) return;

        // Extract statusId from status object if available
        let statusId = deal.statusId || "";
        const statusLabel =
          (deal as unknown as { status?: unknown }).status ??
          (deal as unknown as { dealStatus?: unknown }).dealStatus ??
          "";

        if (
          statusLabel &&
          typeof statusLabel === "object" &&
          "id" in (statusLabel as Record<string, unknown>)
        ) {
          const statusObj = statusLabel as { id: string; name?: string };
          statusId = statusObj.id || statusId;
        }

        // Handle both old and new buyer/seller structures
        const buyer =
          deal.buyer ||
          deal.buyerSellerDetails?.find((d) => d.isBuyer === true);
        const seller =
          deal.seller ||
          deal.buyerSellerDetails?.find((d) => d.isBuyer === false);

        // Extract dealType
        const dealTypeId = deal.dealType?.id || deal.dealTypeId || "";

        // Extract purchaseStatus
        const purchaseStatusId =
          deal.purchaseStatus?.id || deal.purchaseStatusId || "";

        // Extract property data
        const propertyName = deal.property?.name || deal.propertyName || "";
        const propertyTypeId =
          deal.property?.type?.id || deal.propertyTypeId || "";

        // Extract unit data
        const unitNumber = deal.unit?.number || deal.unitNumber || "";
        const unitTypeId = deal.unit?.type?.id || deal.unitTypeId || "";
        const size = deal.unit?.size
          ? String(deal.unit.size)
          : deal.size
          ? String(deal.size)
          : "";

        // Extract buyer/seller nationality, source, and email
        const buyerNationalityId =
          (buyer as { nationality?: { id: string } })?.nationality?.id ||
          (buyer as { nationalityId?: string })?.nationalityId ||
          "";
        const buyerSourceId =
          (buyer as { source?: { id: string } })?.source?.id ||
          (buyer as { sourceId?: string })?.sourceId ||
          "";
        const buyerEmail = (buyer as { email?: string })?.email || "";

        const sellerNationalityId =
          (seller as { nationality?: { id: string } })?.nationality?.id ||
          (seller as { nationalityId?: string })?.nationalityId ||
          "";
        const sellerSourceId =
          (seller as { source?: { id: string } })?.source?.id ||
          (seller as { sourceId?: string })?.sourceId ||
          "";
        const sellerEmail = (seller as { email?: string })?.email || "";

        // Extract agent commission
        let agentCommissionTypeId = "";
        let agentCommissionValue = "";

        if (deal.agentCommissions?.mainAgent) {
          const mainAgent = deal.agentCommissions.mainAgent;
          agentCommissionTypeId = mainAgent.commissionType?.id || "";
          agentCommissionValue = mainAgent.expectedAmount
            ? String(mainAgent.expectedAmount)
            : mainAgent.commissionValue
            ? String(mainAgent.commissionValue)
            : "";
        } else if (deal.commissions) {
          const agentCommission = deal.commissions.find(
            (c) => c.roleId && c.roleId !== ""
          );
          agentCommissionTypeId = agentCommission?.typeId || "";
          agentCommissionValue = agentCommission?.expectedAmount
            ? String(parseFloat(agentCommission.expectedAmount))
            : "";
        }

        // Extract additional agents
        let additionalAgents: Array<{
          agentId?: string;
          externalAgentName?: string;
          commissionTypeId?: string;
          commissionValue?: number;
          isInternal?: boolean;
        }> = [];

        if (deal.agentCommissions?.additionalAgents) {
          additionalAgents = deal.agentCommissions.additionalAgents.map(
            (agent) => ({
              agentId: agent.agent?.id,
              externalAgentName: agent.isInternal
                ? undefined
                : agent.agent?.name,
              commissionTypeId: agent.commissionType?.id,
              commissionValue: agent.commissionValue,
              isInternal: agent.isInternal,
            })
          );
        } else {
          additionalAgents =
            (
              deal as unknown as {
                additionalAgents?: Array<{
                  agentId?: string;
                  externalAgentName?: string;
                  commissionTypeId?: string;
                  commissionValue?: number;
                  isInternal?: boolean;
                }>;
              }
            ).additionalAgents || [];
        }

        // Map to form structure
        const mappedAdditionalAgents = additionalAgents.map((agent) => ({
          type: (agent.isInternal ? "internal" : "external") as
            | "internal"
            | "external",
          agentId: agent.agentId || "",
          agencyName: agent.externalAgentName || "",
          commissionValue: agent.commissionValue
            ? String(agent.commissionValue)
            : "",
          commissionTypeId: agent.commissionTypeId || "",
        }));

        // Extract bedroom data - now nested in unit object
        const bedroomId =
          deal.unit?.bedroom?.id ||
          (deal as unknown as { bedroomId?: string })?.bedroomId ||
          (deal as unknown as { bedroomsId?: string })?.bedroomsId || // backward compatibility
          "";

        // Extract downpayment data
        const downpayment = (deal as unknown as { downpayment?: number })
          ?.downpayment
          ? String((deal as unknown as { downpayment: number }).downpayment)
          : "";

        // Extract topup data
        const topup = deal.topup
          ? String(deal.topup)
          : (deal as unknown as { topUp?: number })?.topUp
          ? String((deal as unknown as { topUp: number }).topUp)
          : "";

        // Reset form with deal data
        reset({
          // Deal Information
          bookingDate: isoToYmd(deal.bookingDate),
          cfExpiry: isoToYmd(deal.cfExpiry),
          closeDate: deal.closeDate ? isoToYmd(deal.closeDate) : "",
          dealTypeId: dealTypeId,
          statusId: statusId,
          purchaseStatusId: purchaseStatusId,
          downpayment: downpayment,

          // Property Details
          developerId: deal.developerId || deal.developer?.id || "",
          projectId: deal.projectId || deal.project?.id || "",
          propertyName: propertyName,
          propertyTypeId: propertyTypeId,
          unitNumber: unitNumber,
          unitTypeId: unitTypeId,
          size: size,
          bedroomId: bedroomId,

          // Seller
          sellerName: seller?.name || "",
          sellerPhone: seller?.phone || "",
          sellerEmail: sellerEmail,
          sellerNationalityId: sellerNationalityId,
          sellerSourceId: sellerSourceId,

          // Buyer
          buyerName: buyer?.name || "",
          buyerPhone: buyer?.phone || "",
          buyerEmail: buyerEmail,
          buyerNationalityId: buyerNationalityId,
          buyerSourceId: buyerSourceId,

          // Commission
          salesValue:
            typeof deal.dealValue === "number"
              ? String(deal.dealValue)
              : deal.dealValue || "",
          agentId: deal.agent?.id || deal.agentId || "",
          agentCommissionTypeId: agentCommissionTypeId,
          commRate: agentCommissionValue,
          totalCommissionTypeId:
            deal.totalCommission?.type?.id || deal.totalCommissionTypeId || "",
          totalCommissionValue: deal.totalCommission?.value
            ? String(deal.totalCommission.value)
            : deal.totalCommission?.commissionValue
            ? String(deal.totalCommission.commissionValue)
            : deal.totalCommissionValue
            ? String(deal.totalCommissionValue)
            : "",

          // Additional Agents (array)
          additionalAgents: mappedAdditionalAgents,

          topup: topup,
          notes: "",
        });

        setLoadedDealId(dealId);
        setLoadedDeal(deal);
      })
      .catch((err: unknown) => {
        const message = getErrorMessage(err, "Failed to load deal");
        setDealError(message);
        console.error("Error loading deal:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [dealId, loadedDealId, dealFetchNonce, reset]);

  const retryLoadDeal = () => {
    setDealError(null);
    setLoadedDealId(null);
    setDealFetchNonce((n) => n + 1);
  };

  return {
    dealError,
    loadedDealId,
    loadedDeal,
    retryLoadDeal,
  };
}
