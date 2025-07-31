import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompanyDetailsApi } from "@/lib/api";
import { CompanyRow } from "@/app/superadmin/companies/page";

type UpdateCompanyPayload = Partial<CompanyRow>;

export const useUpdateCompanyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { companyId: string; updatedData: UpdateCompanyPayload }
  >({
    mutationFn: ({ companyId, updatedData }) =>
      updateCompanyDetailsApi(companyId, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.setQueryData(
        ["company", variables.companyId],
        (oldData: CompanyRow | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            ...variables.updatedData,
            status:
              variables.updatedData.status === "Active"
                ? "Active"
                : variables.updatedData.status === "In-Active"
                ? "In-Active"
                : oldData.status,
            plan: variables.updatedData.plan || oldData.plan,
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating company details:", error.message);
    },
  });
};
