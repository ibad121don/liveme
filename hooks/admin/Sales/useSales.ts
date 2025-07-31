// hooks/useSales.ts
import Sale from "@/models/Sale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { log } from "console";
import Cookies from "js-cookie";

const BASE_URL = "/api/admin/sale";

const getAuthHeaders = () => {
  const token = Cookies.get("authToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  };
};

// GET all sales
const getSales = async () => {
  const res = await axios.get(BASE_URL, getAuthHeaders());
  return res.data.data;
};

// GET specific sale by ID
const getSaleById = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/${id}`, getAuthHeaders());
  return res.data.data;
};

// PUT: Update sale status
const updateSaleStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const res = await axios.put(
    `${BASE_URL}/${id}`,
    { status },
    getAuthHeaders()
  );
  return res.data.sale;
};

export const useSales = () => {
  const queryClient = useQueryClient();
  const {
    data: sales = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  const updateStatus = useMutation({
    mutationFn: updateSaleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
  return {
    sales,
    isLoading,
    isError,
    error,
    updateStatus,
  };
};

export const useSaleById = (id: string) => {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/sale/${id}`, {
        withCredentials: true,
      });
      return res.data.sale;
    },
    enabled: !!id,
  });
};
