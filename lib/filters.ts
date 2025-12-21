// Filter Data Fetching Utilities

import { apiClient } from "./api";

// Filter option types
export interface FilterOption {
  id: string;
  name: string;
  [key: string]: unknown; // Allow additional properties
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function ensureArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord);
}

function normalizeGenericOptions(items: unknown): FilterOption[] {
  const normalized = ensureArray(items)
    .map((item) => {
      const id = item["id"] ?? item["_id"];
      if (!id) return null;
      const name =
        item["name"] ??
        item["status"] ??
        item["title"] ??
        item["label"] ??
        item["value"] ??
        "";
      return {
        ...item,
        id: String(id),
        name: String(name || id),
      } satisfies FilterOption;
    })
    .filter(Boolean) as FilterOption[];

  // If labels collide, append a short ID to disambiguate in dropdowns.
  const counts = new Map<string, number>();
  for (const opt of normalized)
    counts.set(opt.name, (counts.get(opt.name) ?? 0) + 1);
  return normalized.map((opt) => {
    if ((counts.get(opt.name) ?? 0) <= 1) return opt;
    return {
      ...opt,
      name: `${opt.name} (${String(opt.id).slice(0, 8)})`,
    };
  });
}

function normalizeProjects(items: unknown): FilterOption[] {
  const raw = ensureArray(items)
    .map((item) => {
      const id = item["id"] ?? item["_id"];
      if (!id) return null;
      const rawName = item["name"] ?? item["status"] ?? "";
      const developer = item["developer"];
      const developerName =
        (isRecord(developer) ? developer["name"] : undefined) ??
        item["developerName"] ??
        "";
      const baseLabel = developerName
        ? `${rawName} — ${developerName}`
        : `${rawName}`;

      return {
        ...item,
        id: String(id),
        // temporary; we may disambiguate duplicates below
        name: String(baseLabel || rawName || id),
        rawName: String(rawName || ""),
        developerName: String(developerName || ""),
      } satisfies FilterOption;
    })
    .filter(Boolean) as FilterOption[];

  // If labels collide, append a short ID to disambiguate in dropdowns.
  const counts = new Map<string, number>();
  for (const p of raw) counts.set(p.name, (counts.get(p.name) ?? 0) + 1);
  return raw.map((p) => {
    if ((counts.get(p.name) ?? 0) <= 1) return p;
    return {
      ...p,
      name: `${p.name} (${String(p.id).slice(0, 8)})`,
    };
  });
}

// Filter API functions
export const filtersApi = {
  // Get all developers for filter dropdown
  getDevelopers: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/developers");
    return normalizeGenericOptions(data);
  },

  // Get all agents for filter dropdown
  getAgents: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/agents");
    return normalizeGenericOptions(data);
  },

  // Get all projects for filter dropdown
  getProjects: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/projects");
    return normalizeProjects(data);
  },

  // Get all deal statuses
  getStatuses: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/statuses");
    return normalizeGenericOptions(data);
  },

  // Get all commission types
  getCommissionTypes: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/commission-types");
    return normalizeGenericOptions(data);
  },

  // Get all deal types
  getDealTypes: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/deal-types");
    return normalizeGenericOptions(data);
  },

  // Get all property types
  getPropertyTypes: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/property-types");
    return normalizeGenericOptions(data);
  },

  // Get all unit types
  getUnitTypes: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/unit-types");
    return normalizeGenericOptions(data);
  },

  // Get all lead sources
  getLeadSources: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/lead-sources");
    return normalizeGenericOptions(data);
  },

  // Get all nationalities
  getNationalities: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/nationalities");
    return normalizeGenericOptions(data);
  },

  // Get all purchase statuses
  getPurchaseStatuses: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/purchase-statuses");
    return normalizeGenericOptions(data);
  },

  // Get all user roles
  getRoles: async (): Promise<FilterOption[]> => {
    const data = await apiClient<unknown>("/api/filters/user-roles");
    // Roles API returns { id, status } instead of { id, name }
    const roles = ensureArray(data).map((item) => {
      const id = item["id"] ?? item["_id"];
      if (!id) return null;
      const status = item["status"] ?? "";
      return {
        ...item,
        id: String(id),
        name: String(status || id), // Map status to name for consistency
        status: String(status),
      } satisfies FilterOption;
    }).filter(Boolean) as FilterOption[];
    return roles;
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
      roles,
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
      roles,
    };
  } catch (error) {
    console.error("Error fetching filters:", error);
    throw error;
  }
};
