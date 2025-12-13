"use client";

import { useState } from "react";
import Image from "next/image";
import { Login } from "@/components/Login";
import { DashboardAgent } from "@/components/DashboardAgent";
import { DashboardFinance } from "@/components/DashboardFinance";
import { DashboardCEO } from "@/components/DashboardCEO";
import { DashboardAdmin } from "@/components/DashboardAdmin";
import { DealsList } from "@/components/DealsList";
import { DealForm } from "@/components/DealForm";
import { FinanceReview } from "@/components/FinanceReview";
import { Reports } from "@/components/Reports";
import { UserManagement } from "@/components/UserManagement";
import { CommissionEngine } from "@/components/CommissionEngine";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Users, LayoutDashboard, FileText, BarChart3, Settings, LogOut } from "lucide-react";

type UserRole = "agent" | "finance" | "ceo" | "admin";
type View = "dashboard" | "deals" | "newdeal" | "finance" | "reports" | "users" | "commission";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("agent");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const handleLogin = (role: UserRole, username: string) => {
    setCurrentRole(role);
    setCurrentUser(username);
    setIsAuthenticated(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRole("agent");
    setCurrentUser("");
    setCurrentView("dashboard");
    setSelectedDealId(null);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleViewDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    if (currentRole === "finance") {
      setCurrentView("finance");
    } else {
      setCurrentView("newdeal");
    }
  };

  const handleBackToDeals = () => {
    setSelectedDealId(null);
    setCurrentView("deals");
  };

  const handleDealCreated = () => {
    setCurrentView("deals");
  };

  // Allow Finance to edit deal using DealForm
  const handleEditDeal = () => {
    setCurrentView("newdeal");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const names = currentUser.split(" ");
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return currentUser.substring(0, 2).toUpperCase();
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch (currentRole) {
      case "agent": return "Agent";
      case "finance": return "Finance Team";
      case "ceo": return "CEO / Management";
      case "admin": return "Admin";
      default: return "";
    }
  };

  const renderNavigation = () => {
    const navItems = [];

    navItems.push({ view: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard });
    
    if (currentRole === "agent" || currentRole === "finance" || currentRole === "admin") {
      navItems.push({ view: "deals" as View, label: "Deals", icon: FileText });
    }
    
    if (currentRole === "finance" || currentRole === "ceo" || currentRole === "admin") {
      navItems.push({ view: "reports" as View, label: "Reports", icon: BarChart3 });
    }
    
    if (currentRole === "admin") {
      navItems.push({ view: "users" as View, label: "User Management", icon: Users });
      navItems.push({ view: "commission" as View, label: "Commission Rules", icon: Settings });
    }

    return (
      <nav className="flex gap-2 px-6 py-3 bg-[var(--gi-green-20)] dark:bg-gray-800/95 dark:border-t dark:border-gray-700 transition-colors">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant={currentView === item.view ? "default" : "ghost"}
            onClick={() => setCurrentView(item.view)}
            className={`flex items-center gap-2 transition-all ${
              currentView === item.view 
                ? 'gi-bg-dark-green text-white hover:opacity-90 dark:bg-[#4ade80] dark:hover:bg-[#22c55e] dark:text-white shadow-lg font-medium' 
                : 'gi-text-dark-green hover:bg-[var(--gi-green-40)] dark:text-white dark:bg-gray-700/50 dark:hover:bg-gray-600 dark:hover:text-white dark:border dark:border-gray-500'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        if (currentRole === "agent") return <DashboardAgent />;
        if (currentRole === "finance") return <DashboardFinance />;
        if (currentRole === "ceo") return <DashboardCEO />;
        if (currentRole === "admin") return <DashboardAdmin />;
        break;
      case "deals":
        return <DealsList role={currentRole} onViewDeal={handleViewDeal} onNewDeal={() => setCurrentView("newdeal")} />;
      case "newdeal":
        return <DealForm dealId={selectedDealId} onBack={handleBackToDeals} onSave={handleDealCreated} />;
      case "finance":
        return <FinanceReview dealId={selectedDealId} onBack={handleBackToDeals} onEdit={handleEditDeal} />;
      case "reports":
        return <Reports />;
      case "users":
        return <UserManagement />;
      case "commission":
        return <CommissionEngine />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gi-beige-20)] dark:bg-gray-900 transition-colors">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/images/722778733878cdd4ce162bb6767c5c939386c373.png" 
              alt="Gi Properties" 
              width={150}
              height={48}
              className="h-12 w-auto" 
            />
          </div>
          
          {/* Right Side - Theme Toggle and User Avatar */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* User Avatar with Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative h-12 w-12 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="gi-bg-dark-green text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="gi-text-dark-green dark:text-green-400 gi-text-medium">{currentUser}</p>
                    <p className="text-gray-600 dark:text-gray-400">{getRoleDisplay()}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 justify-center border-[var(--gi-dark-green)] gi-text-dark-green dark:border-green-600 dark:text-green-400 hover:gi-bg-dark-green hover:text-white dark:hover:bg-green-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Only show navigation if not in deal form or finance review */}
        {currentView !== "newdeal" && currentView !== "finance" && renderNavigation()}
      </header>

      {/* Main Content */}
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
}
