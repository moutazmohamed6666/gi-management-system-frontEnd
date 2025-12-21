"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { BuyerSellerDetail } from "@/lib/deals";

interface CEOBuyerSellerInfoProps {
  buyer: BuyerSellerDetail | undefined;
  seller: BuyerSellerDetail | undefined;
}

export function CEOBuyerSellerInfo({
  buyer,
  seller,
}: CEOBuyerSellerInfoProps) {
  return (
    <>
      {/* Buyer Information */}
      {buyer && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

