import { setToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { checkIsTenant } from "@/utils/isTenant";
import Cookies from "js-cookie"; // Import Cookies for cookie management
import { getSubdomain } from "@/utils/isTenant";

const baseUrl = process.env.NEXT_PUBLIC_API_URL_ENDPOINT;
const createHeaders = (token: string, additionalHeaders = {}) => {
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (checkIsTenant()) {
    // headers["x-request-origin"] = getSubdomain();
  }
  return { ...headers, ...additionalHeaders };
};
// Function to refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_ENDPOINT}/api/v1/users/refresh-token`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        // ...(checkIsTenant() ? { "x-request-origin": `${getSubdomain()}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }
  const responseData = await response.json();
  return responseData; // Assuming the response contains the new tokens
};

// Function to handle API requests with token refresh logic
const apiRequest = async (
  method: string,
  url: string,
  token: string,
  body?: any,
  additionalHeaders = {},
  retryCount = 0,
) => {
  const response = await fetch(`${baseUrl}${url}`, {
    method,
    headers: createHeaders(token, additionalHeaders),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && retryCount < 1) {
    // Limit to 1 retry
    const refreshToken = Cookies.get("refreshToken"); // Get refresh token from cookies
    if (refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken);

      Cookies.set("accessToken", newTokens.data.accessToken, {
        // expires: 5 / (60 * 24),
        expires: parseInt(newTokens.data.accessTokenExpiry) / (60 * 60 * 24), // Convert seconds to days
      });

      store.dispatch(
        setToken({
          accessToken: newTokens.data.accessToken,
          expiry: parseInt(newTokens.data.accessTokenExpiry) / (60 * 60 * 24),
        }),
      );
      // Retry the original request with the new access token
      return apiRequest(
        method,
        url,
        newTokens.data.accessToken,
        body,
        additionalHeaders,
        retryCount + 1,
      );
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return response.json();
};

export const get = (url: string, token: string, additionalHeaders = {}) =>
  apiRequest("GET", url, token, undefined, additionalHeaders);
export const post = (
  url: string,
  token: string,
  body: any,
  additionalHeaders = {},
) => apiRequest("POST", url, token, body, additionalHeaders);
export const put = (
  url: string,
  token: string,
  body: any,
  additionalHeaders = {},
) => apiRequest("PUT", url, token, body, additionalHeaders);
export const del = (
  url: string,
  token: string,
  body: any,
  additionalHeaders = {},
) => apiRequest("DELETE", url, token, body, additionalHeaders);
export const patch = (
  url: string,
  token: string,
  body: any,
  additionalHeaders = {},
) => apiRequest("PATCH", url, token, body, additionalHeaders);

/**
 * Below functio is being used to make GQL connections
 * @param query | Query string
 * @param variables | Data to be passed
 * @param token | Access Token
 * @returns
 */
export const fetchGraphQLData = async (
  query: string,
  variables: any,
  token: string,
) => {
  try {
    const response = await post("/bms", token, {
      query,
      variables,
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    throw error;
  }
};
