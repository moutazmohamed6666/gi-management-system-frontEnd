"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CompactDateRangeFilter } from "./CompactDateRangeFilter";
import { StyledDatePicker } from "./StyledDatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Download, FileText, Filter, TrendingUp, DollarSign, Target, Users } from "lucide-react";
import { Label } from "./ui/label";
import { mockDeals } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export function Reports() {
  const [reportType, setReportType] = useState("monthly");
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (date && endDate) {
      handleDateChange(date, endDate);
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    if (startDate && date) {
      handleDateChange(startDate, date);
    }
  };

  // Filter deals based on all filters
  const filteredDeals = useMemo(() => {
    let deals = [...mockDeals];

    // Filter by date range
    if (startDate && endDate) {
      deals = deals.filter(deal => {
        if (!deal.dealCloseDate) return false;
        const dealDate = new Date(deal.dealCloseDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the end date
        return dealDate >= start && dealDate <= end;
      });
    }

    // Filter by developer
    if (selectedDeveloper !== "all") {
      deals = deals.filter(deal => deal.developer === selectedDeveloper);
    }

    // Filter by agent
    if (selectedAgent !== "all") {
      deals = deals.filter(deal => deal.agent === selectedAgent);
    }

    return deals;
  }, [startDate, endDate, selectedDeveloper, selectedAgent]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = filteredDeals.reduce((sum, deal) => sum + (deal.commissionReceived || 0), 0);
    const dealsCount = filteredDeals.length;
    const commissionReceived = filteredDeals.reduce((sum, deal) => sum + (deal.commissionReceived || 0), 0);
    const commissionPaidToAgents = filteredDeals.reduce((sum, deal) => sum + (deal.commissionPaid || 0), 0);
    const outstanding = commissionReceived - commissionPaidToAgents;

    return {
      totalRevenue,
      dealsCount,
      commissionReceived,
      outstanding
    };
  }, [filteredDeals]);

  // Generate monthly data from filtered deals
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map<string, { revenue: number; deals: number; units: number }>();

    filteredDeals.forEach(deal => {
      if (deal.dealCloseDate) {
        const date = new Date(deal.dealCloseDate);
        const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        
        const existing = monthlyMap.get(monthKey) || { revenue: 0, deals: 0, units: 0 };
        monthlyMap.set(monthKey, {
          revenue: existing.revenue + (deal.commissionReceived || 0),
          deals: existing.deals + 1,
          units: existing.units + 1
        });
      }
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [filteredDeals]);

  // Generate developer performance data
  const developerData = useMemo(() => {
    const devMap = new Map<string, { deals: number; commission: number; value: number }>();

    filteredDeals.forEach(deal => {
      const existing = devMap.get(deal.developer) || { deals: 0, commission: 0, value: 0 };
      devMap.set(deal.developer, {
        deals: existing.deals + 1,
        commission: existing.commission + (deal.commissionReceived || 0),
        value: existing.value + deal.dealValue
      });
    });

    return Array.from(devMap.entries())
      .map(([developer, data]) => ({ developer, ...data }))
      .sort((a, b) => b.commission - a.commission);
  }, [filteredDeals]);

  // Generate agent performance data
  const agentData = useMemo(() => {
    const agentMap = new Map<string, { deals: number; commission: number; paid: number; unpaid: number }>();

    filteredDeals.forEach(deal => {
      const existing = agentMap.get(deal.agent) || { deals: 0, commission: 0, paid: 0, unpaid: 0 };
      const agentCommission = deal.commissionPaid || 0;
      const unpaid = (deal.commissionReceived || 0) - (deal.commissionPaid || 0);
      
      agentMap.set(deal.agent, {
        deals: existing.deals + 1,
        commission: existing.commission + (deal.commissionReceived || 0),
        paid: existing.paid + agentCommission,
        unpaid: existing.unpaid + unpaid
      });
    });

    return Array.from(agentMap.entries())
      .map(([agent, data]) => ({ agent, ...data }))
      .sort((a, b) => b.commission - a.commission);
  }, [filteredDeals]);

  const handleExport = (format: string) => {
    alert(`Exporting report as ${format}...`);
  };

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
              <p className="text-white/80 mb-2">Business Intelligence</p>
              <h2 className="text-white mb-1">Reports & Analytics</h2>
              <p className="text-white/70">Generate comprehensive business reports</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleExport("Excel")} 
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport("PDF")} 
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-700" />
              <CardTitle>Report Filters</CardTitle>
            </div>
            
            {/* Quick Filters - Top Right */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];
                  setStartDate(todayStr);
                  setEndDate(todayStr);
                }}
                className="px-3 py-1.5 text-sm rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const week = new Date();
                  week.setDate(today.getDate() - 7);
                  setStartDate(week.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 text-sm rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              >
                Week
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const month = new Date();
                  month.setMonth(today.getMonth() - 1);
                  setStartDate(month.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 text-sm rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              >
                Month
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const quarter = new Date();
                  quarter.setMonth(today.getMonth() - 3);
                  setStartDate(quarter.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 text-sm rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              >
                Quarter
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const year = new Date();
                  year.setFullYear(today.getFullYear() - 1);
                  setStartDate(year.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="px-3 py-1.5 text-sm rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
              >
                Year
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Revenue</SelectItem>
                  <SelectItem value="developer">Developer Performance</SelectItem>
                  <SelectItem value="agent">Agent Performance</SelectItem>
                  <SelectItem value="commission">Commission Summary</SelectItem>
                  <SelectItem value="aging">Aging Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="developer">Developer</Label>
              <Select
                value={selectedDeveloper}
                onValueChange={(value) => setSelectedDeveloper(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Developers</SelectItem>
                  <SelectItem value="Emaar">Emaar Properties</SelectItem>
                  <SelectItem value="Damac">Damac Properties</SelectItem>
                  <SelectItem value="Meraas">Meraas</SelectItem>
                  <SelectItem value="Nakheel">Nakheel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agent">Agent</Label>
              <Select
                value={selectedAgent}
                onValueChange={(value) => setSelectedAgent(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Thompson">Mike Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <div className="mt-1">
                <StyledDatePicker
                  id="fromDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  placeholder="Select start date"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <div className="mt-1">
                <StyledDatePicker
                  id="toDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Total Revenue</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900">AED {(summaryMetrics.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 mt-1">{filteredDeals.length > 0 ? "Filtered results" : "No data"}</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Deals Closed</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900">{summaryMetrics.dealsCount}</div>
            <p className="text-sm text-gray-600 mt-1">Total deals</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Commission Received</CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900">AED {(summaryMetrics.commissionReceived / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 mt-1">Total collected</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Outstanding</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900">AED {(summaryMetrics.outstanding / 1000).toFixed(0)}K</div>
            <p className="text-sm text-gray-600 mt-1">To be paid to agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--gi-dark-green)' }}></div>
                <span>Revenue</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--gi-dark-green)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--gi-dark-green)" stopOpacity={0}/>
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
                    formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--gi-dark-green)" strokeWidth={3} name="Revenue (AED)" fill="url(#colorRevenueReport)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                No data available for selected filters
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Developer Performance</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--gi-dark-green)' }}></div>
                <span>Commission</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {developerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={developerData}>
                  <defs>
                    <linearGradient id="colorDeveloperReport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--gi-dark-green)" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="var(--gi-dark-green)" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="developer"
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
                    formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Commission']}
                  />
                  <Bar dataKey="commission" fill="url(#colorDeveloperReport)" radius={[8, 8, 0, 0]} name="Commission (AED)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                No data available for selected filters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Agent Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {agentData.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">Agent</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Deals</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Total Commission</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Paid</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Unpaid</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">Payment %</th>
                  </tr>
                </thead>
                <tbody>
                  {agentData.map((agent, index) => (
                    <tr key={agent.agent} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">{agent.agent}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{agent.deals}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">AED {agent.commission.toLocaleString()}</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">AED {agent.paid.toLocaleString()}</td>
                      <td className="py-3 px-4 text-orange-600 dark:text-orange-400 font-medium">AED {agent.unpaid.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-green-500 dark:bg-green-400 h-2 rounded-full" 
                              style={{ width: `${agent.commission > 0 ? (agent.paid / agent.commission) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span>{agent.commission > 0 ? ((agent.paid / agent.commission) * 100).toFixed(1) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No agent data available for selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Developer Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {developerData.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tl-lg">Developer</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Deals</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Total Value</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100">Commission</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-gray-100 rounded-tr-lg">Avg Deal Size</th>
                  </tr>
                </thead>
                <tbody>
                  {developerData.map((dev) => (
                    <tr key={dev.developer} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">{dev.developer}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{dev.deals}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">AED {dev.value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">AED {dev.commission.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        AED {(dev.value / dev.deals).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No developer data available for selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

