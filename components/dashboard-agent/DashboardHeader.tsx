"use client";

export function DashboardHeader() {
  const currentUser =
    typeof window !== "undefined"
      ? sessionStorage.getItem("username") ||
        sessionStorage.getItem("name") ||
        ""
      : "";

  return (
    <div className="relative overflow-hidden rounded-2xl gi-bg-dark-green p-8 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 mb-2">Welcome back,</p>
            <h2 className="text-white mb-1">{currentUser || "Agent"}</h2>
            <p className="text-white/70">Real Estate Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

