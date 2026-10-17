import axios from "axios";

// VITE_API_URL may be set to either the backend origin or its /api base URL.
// In production, requests should use the Django API mounted under /api.
const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  "https://innovationailabs-edtech-x5sb8.ondigitalocean.app/api";

const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const apiBaseUrl = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const API = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

// Attach the access token to authenticated requests.
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Refresh access tokens using the endpoint defined by Django:
// /api/users/refresh/
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err?.response?.status === 401 &&
      original &&
      !original._retry &&
      localStorage.getItem("refresh")
    ) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${apiBaseUrl}/users/refresh/`,
          { refresh: localStorage.getItem("refresh") },
          { timeout: 20000 }
        );
        const newToken = refreshRes.data.access;
        localStorage.setItem("token", newToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default API;
