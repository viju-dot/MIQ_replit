import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "/api/dooh/audiences";

export interface GeoPlannerFilters {
  market: "UK" | "EU" | "US";
  mode: "Brand" | "Product" | "Category";
  brand: string;
  category: string;
  intelligenceTab: "Audience" | "Commerce" | "TV" | "POI";
  intelligenceFilters: {
    category: string;
    feature: string;
    value: string;
    logic: string;
  };
  topIndexing: "10%" | "15%" | "20%";
}

export interface AudienceGeography {
  points: Array<{ lat: number; lng: number; postcode?: string; city?: string }>;
  radius?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  coverage?: string;
}

export interface Audience {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  geoType: "points" | "polygon" | "radius";
  geoDefinition: AudienceGeography;
  coverage: string;
  accountId: string;
  linkedBrief?: string;
  description?: string;
  plannerVersion?: "v2";
  plannerFilters?: GeoPlannerFilters;
  usageCount: number;
  isActive: boolean;
}

export interface AudienceInput {
  name: string;
  geoType: Audience["geoType"];
  geoDefinition: AudienceGeography;
  coverage: string;
  createdBy?: string;
  accountId?: string;
  linkedBrief?: string;
  description?: string;
  plannerVersion?: "v2";
  plannerFilters?: GeoPlannerFilters;
  allowDuplicate?: boolean;
}

export type AudienceUpdate = Partial<
  Pick<
    AudienceInput,
    | "name"
    | "geoType"
    | "geoDefinition"
    | "coverage"
    | "description"
    | "plannerVersion"
    | "plannerFilters"
  >
>;

async function apiError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error) return new Error(body.error);
  } catch {
    // The explicit fallback below also handles non-JSON server errors.
  }
  return new Error(`${fallback} (${response.status})`);
}

export function useAudiences() {
  return useQuery({
    queryKey: ["dooh-audiences"],
    queryFn: async () => {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw await apiError(res, "Failed to fetch audiences");
      return (await res.json()) as Audience[];
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AudienceInput) => {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw await apiError(res, "Failed to save audience");
      return (await res.json()) as Audience;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] });
    },
  });
}

export function useUpdateAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AudienceUpdate }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw await apiError(res, "Failed to update audience");
      return (await res.json()) as Audience;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] });
    },
  });
}

export function useDeleteAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw await apiError(res, "Failed to delete audience");
      return (await res.json()) as Audience;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] });
    },
  });
}

export function useIncrementAudienceUse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/${id}/use`, { method: "POST" });
      if (!res.ok) throw await apiError(res, "Failed to use audience");
      return (await res.json()) as Audience;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] });
    },
  });
}
