// utils/refreshToken.ts
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_API_URL_ENDPOINT;
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get("refreshToken"); // {{ edit_1 }}

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    // Store the new access token
    localStorage.setItem("access_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};
