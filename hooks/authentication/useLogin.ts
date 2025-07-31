import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface LoginPayload {
  email: string;
  password: string;
  userType: "seller" | "admin" | "superadmin";
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

const loginApiCall = async ({
  email,
  password,
  userType,
}: LoginPayload): Promise<LoginResponse> => {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  let apiUrl = "";

  switch (userType) {
    case "seller":
      apiUrl = `${BASE_URL}/api/seller/sign-in`;
      break;
    case "admin":
      apiUrl = `${BASE_URL}/api/admin/sign-in`;
      break;
    case "superadmin":
      apiUrl = `${BASE_URL}/api/super-admin/sign-in`;
      break;
    default:
      throw new Error("Invalid user type selected.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Login failed: ${response.status} ${response.statusText}`
    );
  }

  return data;
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApiCall,
    onSuccess: (data, variables) => {
      if (data.success && data.token) {
        Cookies.set("isLoggedIn", "true", { expires: 1 });
        Cookies.set("userRole", variables.userType, { expires: 1 });
        Cookies.set("authToken", data.token, { expires: 1 });
        localStorage.setItem("userData", JSON.stringify(data));

        let redirectPath = "/";
        switch (variables.userType) {
          case "seller":
            redirectPath = "/seller/dashboard";
            break;
          case "admin":
            redirectPath = "/admin/dashboard";
            break;
          case "superadmin":
            redirectPath = "/superadmin/dashboard";
            break;
        }
        router.push(redirectPath);

        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      } else {
        throw new Error(
          data.message || "Login failed due to an unknown reason."
        );
      }
    },
    onError: (error) => {
      console.error("Login mutation failed:", error.message);
    },
  });
};
