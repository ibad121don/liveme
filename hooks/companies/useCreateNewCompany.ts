import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from "js-cookie"; 


interface CreateCompanyPayload {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  plan: string;
  password?: string; 
  confirmPassword?: string; 
}


interface CreateCompanyResponse {
  message: string;
  companyId: string; 

}

const createCompanyApi = async (newCompanyData: CreateCompanyPayload): Promise<CreateCompanyResponse> => {
  const authToken = Cookies.get("authToken"); 
 

  if (!authToken) {
    throw new Error("Authentication token not found. Please log in as a super-admin.");
  }

  const response = await fetch('http://localhost:3000/api/super-admin/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`, 
    },
    body: JSON.stringify(newCompanyData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCompanyResponse, Error, CreateCompanyPayload>({
    mutationFn: createCompanyApi,
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      console.log("Company created successfully and companies list invalidated.");
    },
    onError: (error) => {
      console.error("Failed to create company:", error.message);
      
    },
  });
};
