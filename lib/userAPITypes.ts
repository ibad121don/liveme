import mongoose from "mongoose";

export const BASE_URL = "http://localhost:3000";

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: { _id: string; name: string };
  joinedOn: string;
  isActive: boolean;
  lastLogin: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionPlan?: string;
  purchaseDate?: string;
  expiryDate?: string;
}
export interface UserRow {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  joinedOn: string;
  status: string;
  lastLogin: string;
  phone?: string;
  address?: string;
  website?: string;
  plan?: string;
  purchaseDate?: string;
  expiryDate?: string;
  dropdownActions?: string[];
  [key: string]: unknown;
}

export interface AddUserPayload {
  name: string;
  email: string;
  password?: string;
  companyId: string;
  role: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionPlan?: string;
  purchaseDate?: string;
  expiryDate?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  companyId?: string;
  role?: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionPlan?: string;
  purchaseDate?: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  users?: ApiUser[];
  totalCount?: number;
}

export interface Company {
  companyId: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "Company"; // this must match the name used when exporting the Company model
  };
  name: string;
}

export interface CompaniesApiResponse {
  success: boolean;
  message: string;
  companies: Company[];
}
export interface DashboardStats {
  totalRevenueTracked: number;
  activeCompanies: number;
  activeUsers: number;
  subscriptionRevenue: number;
}

export interface DashboardChartData {
  name: string;
  [key: string]: number | string; // e.g., "Jan", "Plan A": 250
}

export interface TopCompany {
  _id: string;
  name: string;
  revenue: number;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  stats: DashboardStats;
  revenueChartData: DashboardChartData[];
  topCompanies: TopCompany[];
}

export type FetchUsersParams = {
  page?: number;
  size?: number;
  q?: string;
};

export type FetchUsersResponse = {
  users: ApiUser[];
  total: number;
  page: number;
  size: number;
  totalCount?: number;
};

// inventory

export interface InventoryItem {
  id: string;
  item: string;
  sportCategory: string;
  sport: string;
  manufacturer: string;
  year: number;
  price: number;
  currentStock: number;
  status: "In stock" | "Out of stock";
  [key: string]: string | number;
}

/// Live Streams
export interface LiveStream {
  id: string;
  streamTitle: string;
  date: string;
  platform: string;
  sales: string;
  revenue: string;
  profit: string;
  status:
    | "Active"
    | "Completed"
    | "draft"
    | "denied"
    | "in-review"
    | "approved";
  transactions: number;
  dropdownActions?: string[];
  saleStatus: string;
  salesBreak: any[];
  directSale: any[];
  [key: string]: string | string[] | number | undefined | any;
}

export interface LiveStreamInput {
  streamTitle: string;
  date: string;
  platform: string;
  sellerId: string;
  companyId: string;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BreakCalculationRequest {
  breakName: string;
  spotCount: number;
  spotPrice: number;
  products: SelectedProduct[];
}

// settings
export interface SellerSettingsPayload {
  firstName?: string;
  lastName?: string;
  password?: string;
  companyName?: string;
  contactEmail?: string;
  role?: "seller" | "admin" | "superadmin";
}

export interface SellerSettingsData {
  _id?: string;
  sellerId: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  contactEmail?: string;
  role?: "seller" | "admin" | "superadmin";
  createdAt?: string;
  updatedAt?: string;
}

export interface SellerSettingsResponse {
  success: boolean;
  data?: SellerSettingsData;
  error?: string;
}

/// calculate
export interface BreakCalculationInput {
  totalAmount: number;
  percentage: number;
  items: number;
}

export interface BreakCalculationResponse {
  success: boolean;
  data?: any; // Adjust if you know the shape
  message?: string;
}
