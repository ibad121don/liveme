// src/hooks/companies/useCompanyById.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyByIdApi } from "@/lib/api";
import { CompanyRow } from "@/app/superadmin/companies/page";

const formatSingleCompanyData = (data: any): CompanyRow => {
  // ⭐ FIX HERE: Adjust based on your actual API response structure ⭐
  // If API returns { company: { ... } }
  const fetchedCompany: CompanyRow = data.company || data; // Try to get from 'company' property, else use data directly

  // If API returns { data: { ... } }
  // const fetchedCompany: CompanyRow = data.data || data;

  // If the API returns the company object directly, your original code was fine:
  // const fetchedCompany: CompanyRow = data;

  console.log("formatSingleCompanyData: Data received for formatting:", data);
  console.log(
    "formatSingleCompanyData: Extracted fetchedCompany:",
    fetchedCompany
  );

  const apiStatus = (
    fetchedCompany.isActive === true ? "active" : "inactive"
  ).toLowerCase();
  let displayStatus: "Active" | "In-Active" = "In-Active";
  if (apiStatus === "active") {
    displayStatus = "Active";
  } else if (apiStatus === "inactive") {
    displayStatus = "In-Active";
  }

  return {
    ...fetchedCompany,
    plan: fetchedCompany.subscriptionPlan || fetchedCompany.plan || "N/A",
    status: displayStatus,
    dropdownActions: ["View details", "Edit Company"],
  };
};

export const useCompanyById = (companyId: string | null) => {
  console.log("useCompanyById hook called with companyId:", companyId);
  interface UseCompanyByIdOptions {
    companyId: string | null;
  }

  interface UseCompanyByIdResult {
    data: CompanyRow | undefined;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  }

  return useQuery<CompanyRow, Error, CompanyRow, [string, string | null]>({
    queryKey: ["company", companyId],
    queryFn: async (): Promise<CompanyRow> => {
      console.log("useCompanyById queryFn running for ID:", companyId);
      if (!companyId) {
        console.error(
          "useCompanyById: companyId is null/empty, throwing error."
        );
        throw new Error("Company ID is required.");
      }
      try {
        const data: any = await fetchCompanyByIdApi(companyId);
        console.log(
          "useCompanyById: Raw data from API for ID",
          companyId,
          ":",
          data
        );
        return formatSingleCompanyData(data);
      } catch (err: any) {
        console.error(
          "useCompanyById: Error in fetchCompanyByIdApi for ID",
          companyId,
          ":",
          err.message
        );
        throw err;
      }
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
  }) as UseCompanyByIdResult;
};
