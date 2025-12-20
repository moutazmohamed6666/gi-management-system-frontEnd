"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { DealOverviewDisplay } from "./DealOverviewDisplay";
import { DealOverviewForm, type DealOverview } from "./DealOverviewForm";

interface DealOverviewSectionProps {
  isDealApproved: boolean;
  isEditingOverview: boolean;
  dealOverview: DealOverview;
  onOverviewChange: (field: string, value: string | number) => void;
}

export function DealOverviewSection({
  isDealApproved,
  isEditingOverview,
  dealOverview,
  onOverviewChange,
}: DealOverviewSectionProps) {
  if (isDealApproved) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="deal-overview">
          <Card>
            <CardHeader className="pb-0">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <CardTitle>Deal Overview</CardTitle>
                  <span
                    className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Approved
                  </span>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="pt-4">
                <DealOverviewDisplay dealOverview={dealOverview} />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deal Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditingOverview ? (
          <DealOverviewForm
            dealOverview={dealOverview}
            onChange={onOverviewChange}
          />
        ) : (
          <DealOverviewDisplay dealOverview={dealOverview} />
        )}
      </CardContent>
    </Card>
  );
}

