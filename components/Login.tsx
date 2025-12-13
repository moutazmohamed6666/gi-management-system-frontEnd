"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ThemeToggle } from "./ThemeToggle";
import { User, Lock, AlertCircle, Building2 } from "lucide-react";

type UserRole = "agent" | "finance" | "ceo" | "admin";

interface UserData {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
}

// Fixed users for each role
const USERS: UserData[] = [
  { username: "agent", password: "123456", role: "agent", displayName: "Agent" },
  { username: "finance", password: "123456", role: "finance", displayName: "Finance Team" },
  { username: "ceo", password: "123456", role: "ceo", displayName: "CEO / Management" },
  { username: "admin", password: "123456", role: "admin", displayName: "Admin" },
];

interface LoginProps {
  onLogin: (role: UserRole, username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        onLogin(user.role, user.displayName);
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--gi-dark-green)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--gi-dark-green)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--gi-dark-green)] opacity-3 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo and Brand Section - Outside the card */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gi-dark-green)] opacity-10 blur-2xl rounded-full"></div>
              <Image 
                src="/images/722778733878cdd4ce162bb6767c5c939386c373.png" 
                alt="Gi Properties" 
                width={200}
                height={96}
                className="h-24 w-auto relative z-10" 
                priority
              />
            </div>
          </div>
          <h1 className="text-gray-900 dark:text-white mb-2">Brokerage Management System</h1>
          <p className="text-gray-600 dark:text-gray-400">Centralize your real estate operations</p>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
            <CardTitle className="text-center text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 dark:text-gray-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    disabled={isLoading}
                    className="pl-10 border-gray-200 dark:border-gray-600 focus:border-[var(--gi-dark-green)] focus:ring-[var(--gi-dark-green)] bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pl-10 border-gray-200 dark:border-gray-600 focus:border-[var(--gi-dark-green)] focus:ring-[var(--gi-dark-green)] bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full gi-bg-dark-green hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                <Building2 className="h-4 w-4" />
                <p className="text-sm">Gi Properties © 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
