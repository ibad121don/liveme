import { useQuery } from "@tanstack/react-query";
import { fetchAllCompaniesApi } from "@/lib/api"; 
import { CompanyRow } from "@/app/superadmin/companies/page";


const formatCompanyData = (data: any): CompanyRow[] => {
  const fetchedCompanies: CompanyRow[] = data.companies || data;

  return fetchedCompanies.map(company => {
    const apiStatus = (company.isActive === true ? 'active' : 'inactive').toLowerCase();
    let displayStatus: "Active" | "In-Active" = "In-Active";
    if (apiStatus === 'active') {
      displayStatus = 'Active';
    } else if (apiStatus === 'inactive') {
      displayStatus = 'In-Active';
    }

    return {
      ...company,
      id: company.id,
      name: company.name || 'N/A',
      email: company.email || 'N/A',
      lastPurchase: company.lastPurchase || 'N/A', 
      plan: company.subscriptionPlan || company.plan || 'N/A',
      status: displayStatus,
      dropdownActions: ["View details", "Edit Company"],
    };
  });
};

export const useCompanies = () => {
  return useQuery<CompanyRow[], Error>({
    queryKey: ["companies"], 
    queryFn: async () => {
      const data = await fetchAllCompaniesApi();
      return formatCompanyData(data);
    },
    staleTime: 1000 * 60 * 5,
  });
};