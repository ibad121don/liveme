// hooks/usePayrolls.ts
import { getAuthToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const usePayrolls = () => {
  return useQuery({
    queryKey: ["payrolls"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/payrolls", {
        headers: getAuthHeaders(),
      });
      // console.log(res.data);

      return res.data.payrolls;
    },
  });
};
