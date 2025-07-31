import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompanyStatusApi } from "@/lib/api";
import { CompanyRow } from "@/app/superadmin/companies/page";

export const useUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { companyId: string; newStatus: "Active" | "In-Active" }
  >({
    mutationFn: ({ companyId, newStatus }) =>
      updateCompanyStatusApi(companyId, newStatus === "Active"),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.setQueryData(
        ["company", variables.companyId],
        (oldData: CompanyRow | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            status: variables.newStatus,
            isActive: variables.newStatus === "Active",
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating company status:", error.message);
    },
  });
};
