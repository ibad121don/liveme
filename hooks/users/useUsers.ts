import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  BASE_URL,
  ApiUser,
  FetchUsersResponse,
  FetchUsersParams,
} from "../../lib/userAPITypes";

const fetchUsersApi = async (
  params: FetchUsersParams
): Promise<FetchUsersResponse> => {
  const authToken = Cookies.get("authToken");
  if (!authToken) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const queryParams = new URLSearchParams();
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size !== undefined)
    queryParams.append("size", params.size.toString());
  if (params.q) queryParams.append("q", params.q);

  const url = `${BASE_URL}/api/super-admin/user?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `Failed to fetch users: ${response.status}`
    );
  }
  const result = await response.json();
  console.log("Fetched users:", result.users);
  return result as FetchUsersResponse;
};

export const useUsers = (params: FetchUsersParams) => {
  return useQuery<FetchUsersResponse, Error>({
    queryKey: ["users", params],
    queryFn: () => fetchUsersApi(params),
  });
};
