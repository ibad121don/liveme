import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventoryItems, createInventoryItem } from "@/lib/api";
import { InventoryItem } from "@/lib/userAPITypes";

export const useInventory = (companyId?: string, sellerId?: string) => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ["inventory", companyId, sellerId],
    queryFn: () => getInventoryItems(companyId, sellerId),
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
