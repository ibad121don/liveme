import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

interface UpdatePayload {
  id: string;
  hoursWorked: number;
}

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hoursWorked }: UpdatePayload) => {
      const res = await axios.put(`/api/admin/payrolls/${id}`, { hoursWorked }, {
        headers: getAuthHeaders(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};
