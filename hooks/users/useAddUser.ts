import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { BASE_URL, AddUserPayload, ApiResponse } from "../../lib/userAPITypes";


const addUserApi = async (newUser: AddUserPayload): Promise<ApiResponse> => {
  const authToken = Cookies.get("authToken");
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const response = await fetch(`${BASE_URL}/api/super-admin/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `Failed to add user: ${response.status}`
    );
  }

  return response.json();
};


export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, AddUserPayload>({
    mutationFn: addUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("User added successfully and user list invalidated.");
    },
    onError: (error) => {
      console.error("Failed to add user:", error.message);
    },
  });
};
