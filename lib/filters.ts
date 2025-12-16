// Filter Data Fetching Utilities

import { apiClient } from "./api";

// Filter option types
export interface FilterOption {
  id: string;
  name: string;
  [key: string]: any; // Allow additional properties
}

// Filter API functions
export const filtersApi = {
  // Get all developers for filter dropdown
  getDevelopers: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/developers");
  },

  // Get all agents for filter dropdown
  getAgents: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/agents");
  },

  // Get all projects for filter dropdown
  getProjects: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/projects");
  },

  // Get all deal statuses
  getStatuses: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/statuses");
  },

  // Get all commission types
  getCommissionTypes: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/commission-types");
  },

  // Get all deal types
  getDealTypes: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/deal-types");
  },

  // Get all property types
  getPropertyTypes: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/property-types");
  },

  // Get all unit types
  getUnitTypes: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/unit-types");
  },

  // Get all lead sources
  getLeadSources: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/lead-sources");
  },

  // Get all nationalities
  getNationalities: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/nationalities");
  },

  // Get all purchase statuses
  getPurchaseStatuses: async (): Promise<FilterOption[]> => {
    return apiClient<FilterOption[]>("/api/filters/purchase-statuses");
  },
};

// Hook-like utility to fetch all filters at once (optional)
export const fetchAllFilters = async () => {
  try {
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
    ]);

    return {
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
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};
