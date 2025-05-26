import { put } from "@/utils/apiCalls";

export const updatePassword = async (token: string, data: any) => {
  try {
    return await put(`/api/v1/users/changePassword`, token, data);
  } catch (error) {
    console.error("Error updating password:", error);
    const errorMessage = JSON.parse((error as Error).message);
    throw new Error(errorMessage.message || "An error occurred");
  }
};
