import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "/api/dooh/audiences";

export interface Audience {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  geoType: "points" | "polygon" | "radius";
  geoDefinition: {
    points?: Array<{ lat: number; lng: number; postcode?: string; city?: string }>;
    radius?: number;
    polygon?: Array<{ lat: number; lng: number }>;
    coverage?: string;
  };
  coverage: string;
  accountId?: string;
  linkedBrief?: string;
  usageCount: number;
  isActive: boolean;
}

export function useAudiences() {
  return useQuery({
    queryKey: ["dooh-audiences"],
    queryFn: async () => {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch audiences");
      return (await res.json()) as Audience[];
    }
  });
}

export function useCreateAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Audience>) => {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save audience");
      }
      return (await res.json()) as Audience;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] })
  });
}

export function useUpdateAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Audience> }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update audience");
      }
      return (await res.json()) as Audience;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] });
    }
  });
}

export function useDeleteAudience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete audience");
      }
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] })
  });
}

export function useIncrementAudienceUse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/${id}/use`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to use audience");
      }
      return (await res.json()) as Audience;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dooh-audiences"] })
  });
}
