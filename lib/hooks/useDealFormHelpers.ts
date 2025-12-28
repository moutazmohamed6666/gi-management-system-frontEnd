"use client";

import { useMemo } from "react";
import { FilterOption } from "../filters";

interface UseDealFormHelpersProps {
  allProjects: FilterOption[];
  watchedDeveloperId: string;
}

export function useDealFormHelpers({
  allProjects,
  watchedDeveloperId,
}: UseDealFormHelpersProps) {
  // Filter projects by selected developer
  const filteredProjects = useMemo(() => {
    if (!watchedDeveloperId) return [];

    type ProjectOption = { developerId?: string };
    const projectsWithDeveloper = allProjects.filter((project) => {
      const devId = (project as unknown as ProjectOption).developerId;
      return devId === watchedDeveloperId;
    });

    return projectsWithDeveloper.length > 0
      ? projectsWithDeveloper
      : allProjects;
  }, [allProjects, watchedDeveloperId]);

  // Get current user role
  const getCurrentRole = () => {
    return (
      (typeof window !== "undefined"
        ? (sessionStorage.getItem("userRole") as
            | "agent"
            | "finance"
            | "ceo"
            | "admin"
            | "SALES_ADMIN"
            | "compliance")
        : "agent") || "agent"
    );
  };

  return {
    filteredProjects,
    getCurrentRole,
  };
}
