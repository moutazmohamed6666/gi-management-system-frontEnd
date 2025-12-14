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
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

type UserRole = "agent" | "finance" | "ceo" | "admin";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>("agent");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const auth = sessionStorage.getItem("isAuthenticated");
    const role = sessionStorage.getItem("userRole") as UserRole;
    const username = sessionStorage.getItem("username");

    if (auth === "true" && role && username) {
      setIsAuthenticated(true);
      setCurrentRole(role);
      setCurrentUser(username);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
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
      default:
        return "";
    }
  };

  const renderNavigation = () => {
    const navItems = [];

    navItems.push({
      view: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });

    if (
      currentRole === "agent" ||
      currentRole === "finance" ||
      currentRole === "admin" ||
      currentRole === "ceo"
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
      navItems.push({ view: "/users", label: "User Management", icon: Users });
      navItems.push({
        view: "/commission",
        label: "Commission Rules",
        icon: Settings,
      });
    }

    return (
      <nav className="flex gap-2 px-6 py-3 bg-[var(--gi-green-20)] dark:bg-gray-800/95 dark:border-t dark:border-gray-700 transition-colors">
        {navItems.map((item) => {
          const isActive =
            pathname === item.view || pathname?.startsWith(item.view + "/");
          return (
            <Link key={item.view} href={item.view}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-all ${
                  isActive
                    ? "gi-bg-dark-green text-white hover:opacity-90 dark:bg-[#4ade80] dark:hover:bg-[#22c55e] dark:text-white shadow-lg font-medium"
                    : "gi-text-dark-green hover:bg-[var(--gi-green-40)] dark:text-white dark:bg-gray-700/50 dark:hover:bg-gray-600 dark:hover:text-white dark:border dark:border-gray-500"
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
    <div className="min-h-screen bg-[var(--gi-beige-20)] dark:bg-gray-900 transition-colors">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4">
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
        {!hideNav && renderNavigation()}
      </header>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
