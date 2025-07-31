import { promises } from "dns";
import Cookies from "js-cookie";
import {
  BreakCalculationInput,
  BreakCalculationRequest,
  BreakCalculationResponse,
  InventoryItem,
  LiveStream,
  LiveStreamInput,
  SellerSettingsPayload,
  SellerSettingsResponse,
} from "./userAPITypes";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const getAuthToken = (): string | null => {
  const token = Cookies.get("authToken");
  return token || null;
};

export const handleApiError = async (response: Response) => {
  const errorData = await response.json();
  throw new Error(
    errorData.message || `API Error: ${response.status} ${response.statusText}`
  );
};

export const fetchAllCompaniesApi = async (): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/company`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    await handleApiError(response);
  }
  return response.json();
};

export const createCompanyApi = async (newCompanyData: any): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/company`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(newCompanyData),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
  return response.json();
};

export const fetchCompanyByIdApi = async (companyId: string): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/company?company_id=${companyId}`;
  console.log("apiUrl in fetchCompanyByIdApi:", apiUrl);

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    await handleApiError(response);
  }
  const responseData = await response.json();
  console.log("Response status in fetchCompanyByIdApi:", responseData);
  return responseData;
};

export const updateCompanyDetailsApi = async (
  companyId: string,
  updatedData: Partial<any>
): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/company?company_id=${companyId}`;
  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
  return response.json();
};

export const updateCompanyStatusApi = async (
  companyId: string,
  isActive: boolean
): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/company/status?company_id=${companyId}`;
  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
  return response.json();
};

export const getConfig = async (): Promise<any> => {
  const authToken = getAuthToken();
  console.log("Auth token:", authToken);
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/system-config`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    await handleApiError(response);
  }

  return response.json();
};

export const updateConfig = async (configData: any): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/super-admin/system-config`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(configData),
    redirect: "follow",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};

// get Dashboard Data without auth token

export const getDashboardData = async (): Promise<any> => {
  const apiUrl = `${BASE_URL}/api/super-admin/dashboard`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    await handleApiError(response);
  }

  return response.json();
};

/// Seller Side Apis ///

/// get and create inventory

export const getInventoryItems = async (
  companyId?: string,
  sellerId?: string
): Promise<InventoryItem[]> => {
  const params = new URLSearchParams();
  if (companyId) params.append("companyId", companyId);
  if (sellerId) params.append("sellerId", sellerId);

  const token = getAuthToken();

  if (!token) {
    console.error("No auth token found");
    throw new Error("Unauthorized: No token available");
  }

  // ✅ Append query parameters to URL
  const apiUrl = `${BASE_URL}/api/seller/inventory?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await response.text();

  if (!response.ok) {
    console.error("Error fetching inventory:", raw);
    throw new Error("Failed to load inventory");
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON response:", raw);
    throw new Error("Invalid JSON from API");
  }
};

export const createInventoryItem = async (
  item: InventoryItem
): Promise<InventoryItem> => {
  const apiUrl = `${BASE_URL}/api/inventory`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Inventory POST Error:", errorText);
    await handleApiError(response);
  }

  return response.json();
};

// Seller Live Streams

export const fetchLiveStreams = async (
  page: number,
  limit: number
): Promise<{
  data: LiveStream[];
  total: number;
}> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Unauthorized: No token available");
  }

  const apiUrl = `${BASE_URL}/api/seller/livestream?page=${page}&limit=${limit}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await response.text();

  if (!response.ok) {
    console.error("Error fetching live streams:", raw);
    throw new Error("Failed to load live streams");
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.data || !Array.isArray(parsed.data)) {
      throw new Error("Invalid response structure");
    }

    return {
      data: parsed.data,
      total: parsed.total || parsed.data.length, // fallback if total not provided
    };
  } catch (e) {
    console.error("Invalid JSON response:", raw);
    throw new Error("Invalid JSON from API");
  }
};

export async function createStream(data: {
  streamTitle: string;
  date: string;
  platform: string;
}) {
  const token = getAuthToken();
  console.log(data);

  if (!token) {
    console.error("No auth token found");
    throw new Error("Unauthorized: No token available");
  }

  const apiUrl = `${BASE_URL}/api/seller/livestream`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log(result);
  if (!res.ok) throw new Error(result.error || "Failed to create stream");
  return result.data;
}

/// break calculator

export async function createBreakCalculation(data: BreakCalculationRequest) {
  const token = getAuthToken();

  if (!token) {
    console.error("No auth token found");
    throw new Error("Unauthorized: No token available");
  }

  const apiUrl = `${BASE_URL}/api/seller/break-calculator`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to calculate break");

  return result.data;
}

export const updateBreakdata = async (
  configData: any,
  id: string
): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/seller/livestream/${id}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(configData),
    redirect: "follow",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};
// direct sale update
export const updateDirectSale = async (
  configData: any,
  id: string
): Promise<any> => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const apiUrl = `${BASE_URL}/api/seller/livestream/${id}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(configData),
    redirect: "follow",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};
/// settings
export const updateSellerSettings = async (
  payload: SellerSettingsPayload
): Promise<SellerSettingsResponse> => {
  const token = getAuthToken();

  if (!token) {
    return { success: false, error: "Unauthorized: No token available" };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/seller/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      console.error("Update Seller Settings Error:", result.error);
      return {
        success: false,
        error: result.error || "Failed to update seller settings",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err: any) {
    console.error("API Error:", err);
    return {
      success: false,
      error: err.message || "Unknown error",
    };
  }
};

export const getSellerSettings = async (): Promise<SellerSettingsResponse> => {
  const token = getAuthToken();

  if (!token) {
    return { success: false, error: "Unauthorized: No token available" };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/seller/settings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Fetch Seller Settings Error:", result.error);
      return {
        success: false,
        error: result.error || "Failed to fetch seller settings",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err: any) {
    console.error("API Error:", err);
    return {
      success: false,
      error: err.message || "Unknown error",
    };
  }
};

/// calculator break

export async function calculateBreak(
  input: BreakCalculationInput
): Promise<BreakCalculationResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Unauthorized: No token available");
  }

  const apiUrl = `${BASE_URL}/api/break-calculator`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to calculate break");
  }

  return result;
}
