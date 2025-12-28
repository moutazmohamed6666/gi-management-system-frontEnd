"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Users,
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { getAuthToken, removeAuthToken } from "@/lib/api";

type UserRole =
  | "agent"
  | "finance"
  | "ceo"
  | "admin"
  | "SALES_ADMIN"
  | "compliance";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>("agent");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication - verify both sessionStorage and token
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole") as UserRole;
    const username = sessionStorage.getItem("username");
    const token = getAuthToken();

    if (auth === "true" && role && username && token) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsAuthenticated(true);
        setCurrentRole(role);
        setCurrentUser(username);
      }, 0);
    } else {
      // Clear any stale data
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userRoleName");
      removeAuthToken();
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all session data
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRoleName");
    removeAuthToken();
    router.push("/login");
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
      case "agent":
        return "Agent";
      case "finance":
        return "Finance Team";
      case "ceo":
        return "CEO / Management";
      case "admin":
        return "Admin";
      case "SALES_ADMIN":
        return "Sales Admin";
      case "compliance":
        return "Compliance";
      default:
        return "";
    }
  };

  const renderNavigation = () => {
    // Dark-mode tab styling presets (NO green). Change this value to pick a look:
    // "slate" | "indigo" | "amber" | "glass"
    const TAB_PRESET: "slate" | "indigo" | "amber" | "glass" = "slate";

    const TAB_STYLES = {
      slate: {
        nav: "flex gap-2 px-6 py-3 bg-[(--gi-green-20)] dark:bg-gray-900 dark:border-t dark:border-gray-700 transition-colors",
        active:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-200 dark:hover:bg-gray-100 dark:text-gray-900 shadow-lg font-semibold",
        inactive:
          "text-gray-700 hover:bg-gray-200/70 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white dark:border dark:border-gray-600/60 font-medium",
      },
      indigo: {
        nav: "flex gap-2 px-6 py-3 bg-[(--gi-green-20)] dark:bg-slate-950 dark:border-t dark:border-slate-800 transition-colors",
        active:
          "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white shadow-lg font-semibold",
        inactive:
          "text-gray-700 hover:bg-gray-200/70 dark:text-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white dark:border dark:border-slate-700 font-medium",
      },
      amber: {
        nav: "flex gap-2 px-6 py-3 bg-[(--gi-green-20)] dark:bg-neutral-950 dark:border-t dark:border-neutral-800 transition-colors",
        active:
          "bg-amber-500 text-black hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-black shadow-lg font-semibold",
        inactive:
          "text-gray-700 hover:bg-gray-200/70 dark:text-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white dark:border dark:border-neutral-700 font-medium",
      },
      glass: {
        nav: "flex gap-2 px-6 py-3 bg-[(--gi-green-20)] dark:bg-slate-950/70 dark:backdrop-blur dark:border-t dark:border-white/10 transition-colors",
        active:
          "bg-white/90 text-gray-900 hover:bg-white dark:bg-white/15 dark:hover:bg-white/20 dark:text-white shadow-lg font-semibold",
        inactive:
          "text-gray-700 hover:bg-gray-200/70 dark:text-white/80 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white dark:border dark:border-white/10 font-medium",
      },
    }[TAB_PRESET];

    let navItems: { view: string; label: string; icon: React.ElementType }[] =
      [];

    if (currentRole !== "SALES_ADMIN" && currentRole !== "compliance") {
      navItems.push({
        view: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      });
    }

    if (
      currentRole === "agent" ||
      currentRole === "finance" ||
      currentRole === "admin" ||
      currentRole === "ceo" ||
      currentRole === "compliance"
    ) {
      navItems.push({ view: "/deals", label: "Deals", icon: FileText });
    }

    if (
      currentRole === "finance" ||
      currentRole === "ceo" ||
      currentRole === "admin"
    ) {
      navItems.push({ view: "/reports", label: "Reports", icon: BarChart3 });
    }

    if (currentRole === "admin") {
      navItems = [];
      navItems.push({ view: "/users", label: "User Management", icon: Users });
    }

    if (currentRole === "SALES_ADMIN") {
      navItems = [];
      navItems.push({
        view: "/dashboard",
        label: "Home",
        icon: LayoutDashboard,
      });
    }

    return (
      <nav className={TAB_STYLES.nav}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.view || pathname?.startsWith(item.view + "/");
          return (
            <Link key={item.view} href={item.view}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-all ${
                  isActive ? TAB_STYLES.active : TAB_STYLES.inactive
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // Don't show navigation on deal form, finance review, or CEO deal view pages
  const hideNav =
    pathname?.includes("/deals/new") ||
    (pathname?.includes("/deals/") &&
      pathname !== "/deals" &&
      !pathname?.includes("/deals/ceo/")) ||
    pathname?.includes("/finance/") ||
    pathname?.includes("/deals/ceo/");

  return (
    <div className="min-h-screen bg-[(--gi-beige-20)] dark:bg-gray-900 transition-colors">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link
            href={
              currentRole === "admin"
                ? "/users"
                : currentRole === "compliance"
                ? "/deals"
                : "/dashboard"
            }
            className="flex items-center gap-4"
          >
            <Image
              src="/images/722778733878cdd4ce162bb6767c5c939386c373.png"
              alt="Gi Properties"
              width={150}
              height={48}
              className="h-12 w-auto"
            />
          </Link>

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
                    <p className="gi-text-dark-green dark:text-green-400 gi-text-medium">
                      {currentUser}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {getRoleDisplay()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 justify-center border-[(--gi-dark-green)] gi-text-dark-green dark:border-green-600 dark:text-green-400 hover:gi-bg-dark-green hover:text-white dark:hover:bg-green-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {!hideNav && renderNavigation()}
      </header>

      {/* Main Content */}
      <main className="sm:p-6 p-2">{children}</main>
    </div>
  );
}
