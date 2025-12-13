"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { mockDeals } from "@/lib/mockData";
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp, FileText, Clock, ArrowUpRight, ArrowDownRight, AlertTriangle, Users, Building2, Send, Hourglass, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export function DashboardFinance() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [developerFilter, setDeveloperFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [commissionTypeFilter, setCommissionTypeFilter] = useState("all");

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Filter deals by date range
  let filteredDeals = mockDeals;
  if (startDate && endDate) {
    filteredDeals = mockDeals.filter(deal => {
      if (!deal.dealCloseDate) return false;
      const dealDate = new Date(deal.dealCloseDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return dealDate >= start && dealDate <= end;
    });
  }

  // Apply additional filters
  if (developerFilter !== "all") {
    filteredDeals = filteredDeals.filter(d => d.developer === developerFilter);
  }
  if (agentFilter !== "all") {
    filteredDeals = filteredDeals.filter(d => d.agentName === agentFilter);
  }
  if (projectFilter !== "all") {
    filteredDeals = filteredDeals.filter(d => d.project === projectFilter);
  }
  if (statusFilter !== "all") {
    filteredDeals = filteredDeals.filter(d => d.status === statusFilter);
  }

  // KPI Calculations
  const totalReceivedThisMonth = filteredDeals
    .filter(d => d.receivedAmount)
    .reduce((sum, d) => sum + (d.receivedAmount || 0), 0);

  const totalExpectedCommission = 785000; // Mock
  const totalPaidCommission = 436500; // Mock
  const pendingCommissionAmount = totalExpectedCommission - totalPaidCommission;

  const commissionBreakdown = {
    agent: 320000,
    manager: 80000,
    company: 36500
  };

  const pendingTransfers = 8; // Mock
  const overdueApprovals = 3; // Mock

  const pendingPayments = filteredDeals.filter(d => d.commissionStatus === "Pending" || d.commissionStatus === "Partially Paid").length;
  
  const dealsWaitingApproval = filteredDeals.filter(d => d.status === "Submitted" || d.status === "Finance Review").length;
  
  const dealsMissingAttachments = 2;
  
  const receivedVsExpected = {
    expected: 500000,
    received: 436500
  };

  const netRevenue = filteredDeals
    .filter(d => d.totalCommission)
    .reduce((sum, d) => sum + (d.totalCommission || 0), 0);

  // Deals by Stage
  const dealsByStage = [
    { name: "Draft", value: 2, color: "#94a3b8" },
    { name: "Submitted", value: 3, color: "#fbbf24" },
    { name: "Finance Review", value: 4, color: "#fb923c" },
    { name: "Approved", value: 5, color: "#60a5fa" },
    { name: "Commission Received", value: 6, color: "#34d399" },
    { name: "Transferred", value: 3, color: "#a78bfa" },
    { name: "Closed", value: 8, color: "#22c55e" }
  ];

  // Exception Alerts
  const exceptions = [
    { type: "Missing buyer data", count: 3, icon: AlertTriangle, color: "text-red-600" },
    { type: "Missing seller data", count: 2, icon: AlertTriangle, color: "text-red-600" },
    { type: "Missing payment receipts", count: 5, icon: FileText, color: "text-orange-600" },
    { type: "Invalid commission rule", count: 1, icon: XCircle, color: "text-red-600" },
    { type: "Manual override pending", count: 2, icon: Clock, color: "text-amber-600" }
  ];

  // Transfer Tracking
  const transferTracking = {
    pendingCount: 8,
    pendingAmount: 125000,
    completedThisMonth: 15,
    completedAmount: 285000,
    avgTimeToTransfer: 4.2
  };

  // Top Performance Data
  const topDevelopers = [
    { name: "Emaar Properties", revenue: 285000 },
    { name: "Damac Properties", revenue: 195000 },
    { name: "Meraas", revenue: 165000 }
  ];

  const topAgents = [
    { name: "Sarah Johnson", revenue: 125000 },
    { name: "Michael Chen", revenue: 98000 },
    { name: "Ahmed Hassan", revenue: 87000 }
  ];

  const topManagers = [
    { name: "David Wilson", revenue: 45000 },
    { name: "Lisa Anderson", revenue: 38000 },
    { name: "Mohammed Ali", revenue: 32000 }
  ];

  // Receivables Forecast
  const forecast = {
    next30Days: 145000,
    next60Days: 220000,
    next90Days: 310000
  };

  // Recent Finance Notes
  const financeNotes = [
    { dealId: "D-2024-003", agent: "Sarah Johnson", note: "Approved with standard terms", timestamp: "2024-03-15 10:30 AM", addedBy: "Finance Team" },
    { dealId: "D-2024-007", agent: "Michael Chen", note: "Pending developer payment confirmation", timestamp: "2024-03-14 03:45 PM", addedBy: "Finance Team" },
    { dealId: "D-2024-010", agent: "Ahmed Hassan", note: "Commission split verified", timestamp: "2024-03-14 11:20 AM", addedBy: "Finance Team" },
    { dealId: "D-2024-012", agent: "Sarah Johnson", note: "Requires manual override approval", timestamp: "2024-03-13 02:15 PM", addedBy: "Finance Team" }
  ];

  // Developer aging report
  const agingData = [
    { developer: "Emaar", current: 43500, days30: 0, days60: 0, days90: 0 },
    { developer: "Damac", current: 0, days30: 0, days60: 0, days90: 0 },
    { developer: "Meraas", current: 0, days30: 123000, days60: 0, days90: 0 },
    { developer: "Nakheel", current: 0, days30: 0, days60: 0, days90: 0 },
  ];

  // Monthly trends
  const monthlyTrends = [
    { month: "Jan", received: 95000, expected: 120000 },
    { month: "Feb", received: 208000, expected: 200000 },
    { month: "Mar", received: 133500, expected: 180000 },
  ];

  const collectionRate = ((receivedVsExpected.received / receivedVsExpected.expected) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-8 text-white shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 mb-2">Finance Team</p>
              <h2 className="text-white mb-1">Financial Overview</h2>
              <p className="text-white/70">Commission tracking & approvals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm">Collection Rate</p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5 text-white" />
                <span className="text-white">{collectionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 space-y-4">
          {/* Date Range Filter */}
          <DateRangeFilter onDateChange={handleDateChange} />

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Developer Filter */}
            <Select value={developerFilter} onValueChange={setDeveloperFilter}>
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                <SelectItem value="Emaar Properties">Emaar Properties</SelectItem>
                <SelectItem value="Damac Properties">Damac Properties</SelectItem>
                <SelectItem value="Meraas">Meraas</SelectItem>
                <SelectItem value="Nakheel">Nakheel</SelectItem>
              </SelectContent>
            </Select>

            {/* Agent Filter */}
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                <SelectItem value="Ahmed Hassan">Ahmed Hassan</SelectItem>
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="Downtown Views">Downtown Views</SelectItem>
                <SelectItem value="Marina Bay">Marina Bay</SelectItem>
                <SelectItem value="Palm Residences">Palm Residences</SelectItem>
              </SelectContent>
            </Select>

            {/* Commission Type Filter */}
            <Select value={commissionTypeFilter} onValueChange={setCommissionTypeFilter}>
              <SelectTrigger className="h-[38px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="override">Manual Override</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Received This Month */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Received (Mar)</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-white">AED {(totalReceivedThisMonth / 1000).toFixed(0)}K</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>15%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month</p>
          </CardContent>
        </Card>

        {/* Total Expected Commission */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Expected Commission</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-white">AED {(totalExpectedCommission / 1000).toFixed(0)}K</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total expected</p>
          </CardContent>
        </Card>

        {/* Total Paid Commission */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Paid Commission</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-white">AED {(totalPaidCommission / 1000).toFixed(0)}K</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Already paid</p>
          </CardContent>
        </Card>

        {/* Pending Commission Amount */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Pending Commission</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900 dark:text-white">AED {(pendingCommissionAmount / 1000).toFixed(0)}K</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Outstanding</p>
          </CardContent>
        </Card>

        {/* Pending Transfers */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Pending Transfers</CardTitle>
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <Send className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900 dark:text-white">{pendingTransfers}</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Awaiting transfer</p>
          </CardContent>
        </Card>

        {/* Overdue Approvals */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Overdue Approvals</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900 dark:text-white">{overdueApprovals}</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Urgent action</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Commission Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-lg border border-green-100 dark:border-green-900/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Agent Commission</div>
              <div className="text-2xl text-gray-900 dark:text-white font-semibold">AED {(commissionBreakdown.agent / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">73.2% of total</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Manager Commission</div>
              <div className="text-2xl text-gray-900 dark:text-white font-semibold">AED {(commissionBreakdown.manager / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">18.3% of total</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Company Retention</div>
              <div className="text-2xl text-gray-900 dark:text-white font-semibold">AED {(commissionBreakdown.company / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">8.5% of total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receivables Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Expected Next 30 Days</CardTitle>
            <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-white">AED {(forecast.next30Days / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">12 deals pending</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Expected Next 60 Days</CardTitle>
            <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-white">AED {(forecast.next60Days / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">18 deals pending</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-sky-50 to-white dark:from-sky-900/20 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">Expected Next 90 Days</CardTitle>
            <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-white">AED {(forecast.next90Days / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">25 deals pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Deals by Stage & Transfer Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals by Stage */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsByStage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  width={130}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  formatter={(value: number) => [`${value} deals`, '']}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Commission Transfers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Commission Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 border border-orange-100 dark:border-orange-900/30">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending Transfers</div>
                    <div className="text-xl text-gray-900 dark:text-white font-semibold">{transferTracking.pendingCount}</div>
                  </div>
                  <div className="text-2xl text-gray-900 dark:text-white font-semibold">AED {(transferTracking.pendingAmount / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Awaiting processing</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border border-green-100 dark:border-green-900/30">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed This Month</div>
                    <div className="text-xl text-gray-900 dark:text-white font-semibold">{transferTracking.completedThisMonth}</div>
                  </div>
                  <div className="text-2xl text-gray-900 dark:text-white font-semibold">AED {(transferTracking.completedAmount / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Successfully transferred</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border border-blue-100 dark:border-blue-900/30">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="pl-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Time to Transfer</div>
                  <div className="text-3xl text-gray-900 dark:text-white font-semibold">{transferTracking.avgTimeToTransfer} days</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Processing speed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exception Alerts */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Exceptions Requiring Action</CardTitle>
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
              {exceptions.reduce((sum, ex) => sum + ex.count, 0)} issues
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exceptions.map((exception, index) => {
              const Icon = exception.icon;
              return (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${exception.color}`} />
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium">{exception.type}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Requires immediate attention</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold">
                      {exception.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performance Mini-Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Developers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <CardTitle>Top Developers by Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDevelopers.map((dev, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{dev.name}</div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">AED {(dev.revenue / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <CardTitle>Top Agents by Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAgents.map((agent, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{agent.name}</div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">AED {(agent.revenue / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Managers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <CardTitle>Top Managers by Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topManagers.map((manager, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{manager.name}</div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">AED {(manager.revenue / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received vs Expected */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Received vs Expected</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600 dark:text-gray-400">Expected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Received</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  formatter={(value: number) => [`AED ${value.toLocaleString()}`, '']}
                />
                <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeWidth={2} name="Expected" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={3} name="Received" fill="url(#colorReceived)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Developer Aging Report */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Developer Aging Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agingData.map((dev) => {
                const total = dev.current + dev.days30 + dev.days60 + dev.days90;
                if (total === 0) return null;
                return (
                  <div key={dev.developer} className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300">
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                      style={{ backgroundColor: 'var(--gi-dark-green)' }}
                    ></div>
                    <div className="pl-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-gray-900 dark:text-white font-medium">{dev.developer}</div>
                        <div className="text-lg text-gray-900 dark:text-white font-semibold">AED {(total / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</div>
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{(dev.current / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">30 days</div>
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{(dev.days30 / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">60 days</div>
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{(dev.days60 / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">90+ days</div>
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{(dev.days90 / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Finance Notes */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Finance Notes</CardTitle>
            <span className="text-sm text-gray-600 dark:text-gray-400">{financeNotes.length} notes</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">Deal ID</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Agent</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Finance Note</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Timestamp</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">Added By</th>
                </tr>
              </thead>
              <tbody>
                {financeNotes.map((note, index) => (
                  <tr 
                    key={index} 
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100 font-medium">{note.dealId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{note.agent}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{note.note}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{note.timestamp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 dark:text-gray-100">{note.addedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deals Requiring Finance Review */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Deals Requiring Finance Review</CardTitle>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {mockDeals.filter(d => d.status === "Submitted" || d.status === "Finance Review").length} deals
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDeals
              .filter(d => d.status === "Submitted" || d.status === "Finance Review")
              .map((deal) => (
                <div 
                  key={deal.id} 
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5 bg-orange-500"
                  ></div>
                  <div className="flex items-center justify-between pl-3">
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{deal.id} - {deal.project}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{deal.agentName} • {deal.buyerName}</div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-lg text-gray-900 dark:text-white font-semibold">AED {(deal.sellingPrice / 1000).toFixed(0)}K</div>
                      <div className="inline-flex px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r from-orange-600 to-orange-500">
                        {deal.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

