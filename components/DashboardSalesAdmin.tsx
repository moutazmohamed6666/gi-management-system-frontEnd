"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FileText, Plus, Building2, CheckCircle } from "lucide-react";

export function DashboardSalesAdmin() {
  const router = useRouter();

  const handleCreateDeal = () => {
    router.push("/deals/new");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full gi-bg-dark-green/10 dark:bg-green-900/30 flex items-center justify-center">
              <Building2 className="h-8 w-8 gi-text-dark-green dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sales Admin Portal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Create and submit new deals for the brokerage system
          </p>
        </div>

        {/* Create Deal Card */}
        <Card
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[var(--gi-dark-green)] dark:hover:border-green-500 transition-all duration-300 cursor-pointer group"
          onClick={handleCreateDeal}
        >
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:gi-bg-dark-green/10 dark:group-hover:bg-green-900/30 flex items-center justify-center transition-colors">
                <Plus className="h-10 w-10 text-gray-400 group-hover:gi-text-dark-green dark:group-hover:text-green-400 transition-colors" />
              </div>
            </div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Create New Deal
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Start a new real estate transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button
              onClick={handleCreateDeal}
              className="gi-bg-dark-green hover:opacity-90 text-white px-8 py-6 text-lg font-medium"
            >
              <FileText className="h-5 w-5 mr-2" />
              Create Deal
            </Button>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <CheckCircle className="h-5 w-5 gi-text-dark-green dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Quick Submission
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submit deals with all required details in one form
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <CheckCircle className="h-5 w-5 gi-text-dark-green dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Document Upload
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Attach supporting documents after deal creation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
