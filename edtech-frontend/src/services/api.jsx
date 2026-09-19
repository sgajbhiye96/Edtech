import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jellyfish-app-6plcw.ondigitalocean.app/",
  timeout: 15000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err?.response?.status === 401 && !original._retry && localStorage.getItem("refresh")) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL || "https://edtech-backend-f7p4.onrender.com/api"}/token/refresh/`,
          { refresh: localStorage.getItem("refresh") }
        );
        const newToken = refreshRes.data.access;
        localStorage.setItem("token", newToken);
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
