import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { BASE_URL, DashboardApiResponse } from "../../lib/userAPITypes"; 


const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
  const authToken = Cookies.get("authToken");
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const response = await fetch(`${BASE_URL}/api/super-admin/dashboard`, { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    let errorDetail = "Unknown error";
    try {
      const errorData = await response.json();
      errorDetail = errorData.message || JSON.stringify(errorData); 
    } catch (e) {
      errorDetail = response.statusText || `Status: ${response.status}`;
    }
    throw new Error(`Failed to fetch dashboard data: ${errorDetail}`);
  }

  return response.json();
};


export const useDashboardData = () => {
  return useQuery<DashboardApiResponse, Error>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.error("Failed to load dashboard data:", error.message);
    },
  });
};
