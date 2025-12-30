"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { dealsApi, type Deal, type BuyerSeller } from "@/lib/deals";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { CEODealInfo } from "./ceo/CEODealInfo";
import { CEOCommissionDetails } from "./ceo/CEOCommissionDetails";
import { CEOPropertyDetails } from "./ceo/CEOPropertyDetails";
import { DealMediaUpload } from "./DealMediaUpload";
import { CommissionCollectionSummary } from "./CommissionCollectionSummary";

interface ComplianceDealViewProps {
  dealId: string;
  onBack: () => void;
}

export function ComplianceDealView({
  dealId,
  onBack,
}: ComplianceDealViewProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchDeal = useCallback(async () => {
    if (!dealId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dealData = await dealsApi.getDealById(dealId);
      setDeal(dealData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load deal";
      setError(errorMessage);
      toast.error("Error loading deal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  const handleBackToDeals = () => {
    onBack();
  };

  const handleMediaUploadBack = () => {
    // Stay on the same page, just switch to overview tab
    setActiveTab("overview");
  };

  const handleCompleteCompliance = async () => {
    if (!deal) return;

    setIsCompleting(true);
    try {
      await dealsApi.completeCompliance(deal.id);

      toast.success("Compliance Completed", {
        description: `Deal ${deal.dealNumber} has been marked as compliance completed.`,
        duration: 3000,
      });

      // Refresh deal data to get updated status
      await fetchDeal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to complete compliance";
      toast.error("Compliance Failed", {
        description: errorMessage,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading deal...
        </span>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToDeals}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deals
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">
                {error || "Deal not found"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract buyer and seller - support both old and new API structure
  const buyer = (deal.buyer ||
    deal.buyerSellerDetails?.find((d) => d.isBuyer === true)) as
    | BuyerSeller
    | undefined;
  const seller = (deal.seller ||
    deal.buyerSellerDetails?.find((d) => d.isBuyer === false)) as
    | BuyerSeller
    | undefined;

  return (
    <div className="space-y-6">
      {/* Header with compliance action button */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Back button and Deal ID */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToDeals}
            size="sm"
            className="lg:size-default shrink-0"
          >
            <ArrowLeft className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Back to Deals</span>
          </Button>
          <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden lg:inline">Deal ID: </span>
            <span className="font-mono text-xs lg:text-sm">{deal.id}</span>
          </div>
        </div>

        {/* Completed button */}
        <div className="flex justify-end shrink-0">
          {isCompleting ? (
            <Button
              variant="default"
              disabled
              size="sm"
              className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 lg:size-default w-full sm:w-auto"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Completing...</span>
              <span className="sm:hidden">Completing</span>
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleCompleteCompliance}
              size="sm"
              className="flex items-center gap-1 lg:gap-2 bg-green-600 hover:bg-green-700 text-white lg:size-default w-full sm:w-auto"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Complete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Deal Number and Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-lg sm:text-xl">Deal {deal.dealNumber}</span>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 truncate">
              {deal.project?.name || "No Project"}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs for Overview and Media Upload */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media Upload</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Deal Information */}
          <CEODealInfo deal={deal} />

          {/* Commission Details - Summary only (Breakdown hidden) */}
          <CEOCommissionDetails
            deal={deal}
            commissions={deal.commissions || []}
          />

          {/* Commission Summary */}
          <CommissionCollectionSummary
            expectedCommissions={
              deal.totalCommission?.commissionValue ||
              deal.totalCommission?.value ||
              deal.agentCommissions?.totalExpected ||
              0
            }
            collectedCommissions={
              deal.collectedCommissions?.totalCollected || 0
            }
            transferredCommissions={
              deal.transferredCommissions?.totalTransferred || 0
            }
            collections={deal.collectedCommissions?.collections || []}
            transfers={deal.transferredCommissions?.transfers || []}
            showCollectionHistory={true}
            showTransferHistory={true}
          />

          {/* Property Details */}
          <CEOPropertyDetails deal={deal} />

          {/* Buyer, Seller, and Agent Information - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buyer Information */}
            {buyer && (
              <Card>
                <CardHeader>
                  <CardTitle>Buyer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Buyer Name
                      </div>
                      <div className="text-base text-gray-900 dark:text-white font-medium">
                        {buyer.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Buyer Phone
                      </div>
                      <div className="text-base text-gray-900 dark:text-white font-medium">
                        {buyer.phone || "-"}
                      </div>
                    </div>
                    {(buyer as BuyerSeller).email && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Buyer Email
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(buyer as BuyerSeller).email}
                        </div>
                      </div>
                    )}
                    {(buyer as BuyerSeller).nationality && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Nationality
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(buyer as BuyerSeller).nationality?.name}
                        </div>
                      </div>
                    )}
                    {(buyer as BuyerSeller).source && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Source
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(buyer as BuyerSeller).source?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seller Information */}
            {seller && (
              <Card>
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Seller Name
                      </div>
                      <div className="text-base text-gray-900 dark:text-white font-medium">
                        {seller.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Seller Phone
                      </div>
                      <div className="text-base text-gray-900 dark:text-white font-medium">
                        {seller.phone || "-"}
                      </div>
                    </div>
                    {(seller as BuyerSeller).email && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Seller Email
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(seller as BuyerSeller).email}
                        </div>
                      </div>
                    )}
                    {(seller as BuyerSeller).nationality && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Nationality
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(seller as BuyerSeller).nationality?.name}
                        </div>
                      </div>
                    )}
                    {(seller as BuyerSeller).source && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Source
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {(seller as BuyerSeller).source?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Agent Information */}
            <Card>
              <CardHeader>
                <CardTitle>Main Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Agent Name
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {deal.agent?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Agent Email
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      {deal.agent?.email || "-"}
                    </div>
                  </div>
                  {deal.manager && (
                    <>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Manager Name
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {deal.manager.name || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Manager Email
                        </div>
                        <div className="text-base text-gray-900 dark:text-white font-medium">
                          {deal.manager.email || "-"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Agents Section */}
          {deal.agentCommissions?.additionalAgents &&
            deal.agentCommissions.additionalAgents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deal.agentCommissions.additionalAgents.map(
                      (additionalAgent, index) => (
                        <div
                          key={additionalAgent.id || index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {additionalAgent.agent?.name || "External Agent"}
                            </div>
                            <div className="flex items-center gap-1">
                              {additionalAgent.isInternal ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  Internal
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                  External
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            {additionalAgent.agent?.email && (
                              <div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Email
                                </div>
                                <div className="text-gray-900 dark:text-white">
                                  {additionalAgent.agent.email}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Commission Type
                              </div>
                              <div className="text-gray-900 dark:text-white">
                                {additionalAgent.commissionType?.name || "-"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Commission Value
                              </div>
                              <div className="text-base font-semibold text-green-600 dark:text-green-400">
                                AED{" "}
                                {additionalAgent.commissionValue?.toLocaleString() ||
                                  "0"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Existing Media Files Section */}
          {deal.media && deal.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deal.media.map((mediaItem) => (
                    <div
                      key={mediaItem.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mediaItem.mediaType.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>File: {mediaItem.filename}</div>
                        <div>
                          Size: {(mediaItem.fileSize / 1024).toFixed(2)} KB
                        </div>
                        <div>Uploaded by: {mediaItem.uploadedBy.name}</div>
                        <div>
                          Date:{" "}
                          {new Date(mediaItem.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Media Upload Tab */}
        <TabsContent value="media" className="space-y-6">
          <DealMediaUpload dealId={dealId} onBack={handleMediaUploadBack} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
