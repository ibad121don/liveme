// src/hooks/users/useUpdateUserStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { BASE_URL, UpdateUserPayload, ApiResponse } from '../../lib/userAPITypes';

interface UpdateUserStatusMutationParams {
  userId: string;
  newStatus: "Active" | "In-Active";
}

const updateUserStatusApi = async ({ userId, newStatus }: UpdateUserStatusMutationParams): Promise<ApiResponse> => {
  const authToken = Cookies.get("authToken");
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }


  const url = `${BASE_URL}/api/super-admin/user/status/${userId}`;
  

  const payload: UpdateUserPayload = {
    isActive: newStatus === "Active",
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to update user status: ${response.status}`);
  }

  return response.json();
};


export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, UpdateUserStatusMutationParams>({
    mutationFn: updateUserStatusApi,
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      console.log("User status updated successfully and queries invalidated.");
    },
    onError: (error) => {
      console.error("Failed to update user status:", error.message);
    },
  });
};
