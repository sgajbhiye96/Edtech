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

// Keep administrator credentials separate from student credentials. Admin pages
// use admin_token/admin_refresh; public student pages use token/refresh.
const isAdminRoute = () => window.location.pathname.startsWith("/admin");

API.interceptors.request.use((req) => {
  const token = isAdminRoute()
    ? localStorage.getItem("admin_token")
    : localStorage.getItem("token");

  if (token) {
    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${token}`;
  } else if (req.headers?.Authorization) {
    delete req.headers.Authorization;
  }

  return req;
});

// Refresh the token using the credential set for the current area of the site.
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const adminRoute = isAdminRoute();
    const refreshKey = adminRoute ? "admin_refresh" : "refresh";
    const accessKey = adminRoute ? "admin_token" : "token";
    const refreshToken = localStorage.getItem(refreshKey);
    const isAuthEndpoint = /\/users\/(login|refresh)\/$/.test(original?.url || "");

    if (
      err?.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint &&
      refreshToken
    ) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${apiBaseUrl}/users/refresh/`,
          { refresh: refreshToken },
          { timeout: 20000 }
        );
        const newToken = refreshRes.data.access;
        localStorage.setItem(accessKey, newToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);
      } catch {
        localStorage.removeItem(accessKey);
        localStorage.removeItem(refreshKey);
        if (adminRoute) {
          window.location.href = "/admin/login";
        } else {
          localStorage.removeItem("username");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(err);
  }
);

export default API;
