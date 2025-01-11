import axios, { AxiosRequestConfig } from "axios";
import config from "./config.json";

// Helper function to create request options with CSRF and Authorization headers
const createRequestOptions = (
  csrfToken: string,
  authToken: string,
  customOptions: AxiosRequestConfig = {}
) => {
  return {
    ...customOptions,
    headers: {
      ...customOptions.headers,
      "x-csrf-token": csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
    withCredentials: true, // Include credentials in the request
  };
};

// Helper to get a cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

// This function dispatches an API request and automatically adds tokens to headers
const dispatchApiRequest = async (formData: any, endpoint: string) => {
  // Get CSRF token and Auth token from cookies
  const csrfToken = getCookie("csrf-token"); // Use the actual cookie name for CSRF token
  const authToken = getCookie("auth-token") || ""; // Use the actual cookie name for Auth token

  if (!csrfToken || !authToken) {
    throw new Error("CSRF Token or Auth Token is missing");
  }

  try {
    const response = await axios.post(
      `${config.API_BASE_URL}${endpoint}`, // Automatically add API base URL
      formData,
      createRequestOptions(csrfToken, authToken)
    );
    return response.data; // Return the response data
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export { dispatchApiRequest };
