// React Hook for fetching filter data
"use client";

import { useState, useEffect } from "react";
import { filtersApi, FilterOption } from "./filters";

interface UseFiltersReturn {
  developers: FilterOption[];
  agents: FilterOption[];
  projects: FilterOption[];
  statuses: FilterOption[];
  commissionTypes: FilterOption[];
  dealTypes: FilterOption[];
  propertyTypes: FilterOption[];
  unitTypes: FilterOption[];
  leadSources: FilterOption[];
  nationalities: FilterOption[];
  purchaseStatuses: FilterOption[];
  roles: FilterOption[];
  bedrooms: FilterOption[];
  mediaTypes: FilterOption[];
  areas: FilterOption[];
  teams: FilterOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<
    Omit<UseFiltersReturn, "isLoading" | "error" | "refetch">
  >({
    developers: [],
    agents: [],
    projects: [],
    statuses: [],
    commissionTypes: [],
    dealTypes: [],
    propertyTypes: [],
    unitTypes: [],
    leadSources: [],
    nationalities: [],
    purchaseStatuses: [],
    roles: [],
    bedrooms: [],
    mediaTypes: [],
    areas: [],
    teams: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        developers,
        agents,
        projects,
        statuses,
        commissionTypes,
        dealTypes,
        propertyTypes,
        unitTypes,
        leadSources,
        nationalities,
        purchaseStatuses,
        roles,
        bedrooms,
        mediaTypes,
        areas,
        teams,
      ] = await Promise.all([
        filtersApi.getDevelopers(),
        filtersApi.getAgents(),
        filtersApi.getProjects(),
        filtersApi.getStatuses(),
        filtersApi.getCommissionTypes(),
        filtersApi.getDealTypes(),
        filtersApi.getPropertyTypes(),
        filtersApi.getUnitTypes(),
        filtersApi.getLeadSources(),
        filtersApi.getNationalities(),
        filtersApi.getPurchaseStatuses(),
        filtersApi.getRoles(),
        filtersApi.getBedrooms(),
        filtersApi.getMediaTypes(),
        filtersApi.getAreas(),
        filtersApi.getTeams(),
      ]);

      setFilters({
        developers,
        agents,
        projects,
        statuses,
        commissionTypes,
        dealTypes,
        propertyTypes,
        unitTypes,
        leadSources,
        nationalities,
        purchaseStatuses,
        roles,
        bedrooms,
        mediaTypes,
        areas,
        teams,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch filters";
      setError(message);
      console.error("Error fetching filters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  return {
    ...filters,
    isLoading,
    error,
    refetch: fetchFilters,
  };
}
