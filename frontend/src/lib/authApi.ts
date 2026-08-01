import { apiClient, type ApiEnvelope } from "./apiClient";

export interface Company {
  id: number;
  company_name: string;
  company_email: string;
  website?: string | null;
  address?: string | null;
  logo?: string | null;
  created_at: string;
}

export interface CurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "HR_ADMIN" | "HR_USER";
  company: Company;
  is_active: boolean;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  company_name: string;
  company_email: string;
  website?: string;
  address?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ user: CurrentUser; tokens: AuthTokens }>
  >("/auth/login/", { email, password });
  return data.data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ user: CurrentUser; tokens: AuthTokens }>
  >("/auth/register/", payload);
  return data.data;
}

export async function logout(refreshToken: string) {
  await apiClient.post("/auth/logout/", { refresh: refreshToken });
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<ApiEnvelope<CurrentUser>>("/auth/me/");
  return data.data;
}

// --- Super Admin: multi-tenant management ---

export interface Tenant extends Company {
  employee_count: number;
}

export interface CreateTenantPayload {
  company_name: string;
  company_email: string;
  website?: string;
  address?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
}

export async function listTenants() {
  const { data } = await apiClient.get<ApiEnvelope<Tenant[]>>(
    "/auth/admin/companies/"
  );
  return data.data;
}

export async function createTenant(payload: CreateTenantPayload) {
  const { data } = await apiClient.post<
    ApiEnvelope<{ company: Company; admin: CurrentUser }>
  >("/auth/admin/companies/", payload);
  return data.data;
}
