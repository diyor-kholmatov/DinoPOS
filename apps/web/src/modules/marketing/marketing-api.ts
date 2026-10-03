import type { MarketingContent, MarketingLocale } from "./marketing-content";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  businessName: string;
  city?: string;
  storeCount?: number;
  message?: string;
  locale: MarketingLocale;
  status: LeadStatus;
  createdAt: string;
};

export const marketingApiUrl = (import.meta.env.VITE_MARKETING_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!marketingApiUrl) throw new Error("Marketing API is not configured");
  const response = await fetch(`${marketingApiUrl}${path}`, init);
  if (!response.ok) throw new Error(`Marketing API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export function loadPublicContent(signal?: AbortSignal) {
  return apiRequest<MarketingContent>("/api/public/content", { signal });
}

export function createLead(payload: Record<string, unknown>) {
  return apiRequest<Lead>("/api/public/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function loadAdminLeads(authorization: string) {
  return apiRequest<Lead[]>("/api/admin/leads", { headers: { Authorization: authorization } });
}

export function loadAdminContent(authorization: string) {
  return apiRequest<MarketingContent>("/api/admin/content", { headers: { Authorization: authorization } });
}

export function saveAdminContent(authorization: string, content: MarketingContent) {
  return apiRequest<MarketingContent>("/api/admin/content", {
    method: "PUT",
    headers: { Authorization: authorization, "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
}

export function updateLeadStatus(authorization: string, id: number, status: LeadStatus) {
  return apiRequest<Lead>(`/api/admin/leads/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: authorization, "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
