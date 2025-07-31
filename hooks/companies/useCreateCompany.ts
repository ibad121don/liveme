import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanyApi } from "@/lib/api"; 
import { CompanyRow } from "@/app/superadmin/companies/page"; 

type CreateCompanyPayload = Omit<CompanyRow, 'id' | 'status' | 'lastPurchase' | 'dropdownActions' | 'plan'> & {
  password: string;
  confirmPassword: string;
  subscriptionPlan: string;
  isActive: boolean;
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateCompanyPayload>({
    mutationFn: createCompanyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Error creating company:", error.message);
    },
  });
};