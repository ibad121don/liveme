import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "/api/admin/inventory";

// =================== API Calls =================== //

const getAuthHeaders = () => {
  const token = Cookies.get("authToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  };
};

const getInventoryItems = async () => {
  const res = await axios.get(BASE_URL, getAuthHeaders());
  return res.data.data;
};

const addInventoryItem = async (item: any) => {
  const res = await axios.post(BASE_URL, item, getAuthHeaders());
  return res.data.data;
};

const updateInventoryItem = async (id: string, item: any) => {
  const res = await axios.put(`${BASE_URL}/${id}`, item, getAuthHeaders());
  return res.data.data;
};

const deleteInventoryItem = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
  return res.data.data;
};

// =================== Custom Hook =================== //

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  });

  const addItem = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, item }: { id: string; item: any }) =>
      updateInventoryItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    addItem,
    updateItem,
    deleteItem,
  };
};
