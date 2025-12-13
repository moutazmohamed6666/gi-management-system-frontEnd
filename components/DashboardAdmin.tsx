"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DateRangeFilter } from "./DateRangeFilter";
import { mockUsers, mockDeals, mockCommissionRules } from "@/lib/mockData";
import { Users, FileText, Settings, Database, Activity, Shield, ArrowUpRight, UserPlus, Cog } from "lucide-react";

export function DashboardAdmin() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === "Active").length;
  const totalDeals = filteredDeals.length;
  const commissionRules = mockCommissionRules.length;
  const recentActivity = 24; // Mock value

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
              <p className="text-white/80 mb-2">System Administrator</p>
              <h2 className="text-white mb-1">Admin Dashboard</h2>
              <p className="text-white/70">System management & configuration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-5 w-5 text-white" />
                <span className="text-white">Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={handleDateChange} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Total Users</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">{totalUsers}</div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>5%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{activeUsers} active</p>
          </CardContent>
        </Card>

        {/* Total Deals */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Total Deals</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">{totalDeals}</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        {/* Commission Rules */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Commission Rules</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">{commissionRules}</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Active rules</p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">Recent Activity</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl text-gray-900">{recentActivity}</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm text-gray-700">System Status</CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl text-gray-900">Healthy</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* User Overview by Role */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>User Overview by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-gray-900 mb-2">Agents</div>
                <div className="text-3xl text-blue-600 font-semibold">{mockUsers.filter(u => u.role === "agent").length}</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-gray-900 mb-2">Finance Team</div>
                <div className="text-3xl text-green-600 font-semibold">{mockUsers.filter(u => u.role === "finance").length}</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-gray-900 mb-2">CEO / Management</div>
                <div className="text-3xl text-purple-600 font-semibold">{mockUsers.filter(u => u.role === "ceo").length}</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 opacity-5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-gray-900 mb-2">Admins</div>
                <div className="text-3xl text-orange-600 font-semibold">{mockUsers.filter(u => u.role === "admin").length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent System Activity</CardTitle>
            <span className="text-sm text-gray-600">Last 24 hours</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex items-center justify-between pl-3">
                <div>
                  <div className="text-gray-900 font-medium">Deal D001 status updated</div>
                  <div className="text-sm text-gray-600">Emily Rodriguez • Finance Team</div>
                </div>
                <div className="text-sm text-gray-600">2 hours ago</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
              <div className="flex items-center justify-between pl-3">
                <div>
                  <div className="text-gray-900 font-medium">New deal D003 created</div>
                  <div className="text-sm text-gray-600">Mike Thompson • Agent</div>
                </div>
                <div className="text-sm text-gray-600">5 hours ago</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
              <div className="flex items-center justify-between pl-3">
                <div>
                  <div className="text-gray-900 font-medium">Commission rule updated for Emaar</div>
                  <div className="text-sm text-gray-600">Admin User • Admin</div>
                </div>
                <div className="text-sm text-gray-600">1 day ago</div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
              <div className="flex items-center justify-between pl-3">
                <div>
                  <div className="text-gray-900 font-medium">User Sarah Johnson logged in</div>
                  <div className="text-sm text-gray-600">Agent</div>
                </div>
                <div className="text-sm text-gray-600">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Rules Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Commission Rules Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCommissionRules.map((rule) => (
                <div 
                  key={rule.id} 
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5" style={{ backgroundColor: 'var(--gi-dark-green)' }}></div>
                  <div className="pl-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-900 font-medium">{rule.developer}</div>
                      <div className="text-lg text-gray-900 font-semibold">{rule.commissionValue}%</div>
                    </div>
                    {rule.project && (
                      <div className="text-sm text-gray-600 mb-2">{rule.project}</div>
                    )}
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span>Agent: <span className="text-gray-900 font-medium">{rule.agentSplit}%</span></span>
                      <span>Manager: <span className="text-gray-900 font-medium">{rule.managerSplit}%</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-left">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Create New User</span>
                </div>
              </button>
              <button className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-50 to-white border border-green-100 hover:border-green-300 hover:shadow-md transition-all duration-300 text-left">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Add Commission Rule</span>
                </div>
              </button>
              <button className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Export System Data</span>
                </div>
              </button>
              <button className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-300 text-left">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-gray-900 font-medium">View Audit Logs</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

