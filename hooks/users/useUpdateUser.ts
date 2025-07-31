// src/hooks/users/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { BASE_URL, UpdateUserPayload, ApiResponse } from '../../lib/userAPITypes';

interface UpdateUserMutationParams {
  userId: string;
  updatedData: UpdateUserPayload;
}


const updateUserApi = async ({ userId, updatedData }: UpdateUserMutationParams): Promise<ApiResponse> => {
  const authToken = Cookies.get("authToken");
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

   
  const url = `${BASE_URL}/api/super-admin/user/${userId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to update user: ${response.status}`);
  }

  return response.json();
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, UpdateUserMutationParams>({
    mutationFn: updateUserApi,
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      console.log("User updated successfully and queries invalidated.");
    },
    onError: (error) => {
      console.error("Failed to update user:", error.message);
    },
  });
};
