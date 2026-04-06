import axios from "axios";
const API = axios.create({
baseURL:
import.meta.env.VITE_API_URL ||
"https://edtech-backend-f7p4.onrender.com/api",
timeout: 15000, // 15s timeout (Render free tier cold starts are slow)
});
// ── Attach token to every request ──
API.interceptors.request.use((req) => {
const token = localStorage.getItem("token");
if (token) {
req.headers.Authorization = `Bearer ${token}`;
}
return req;
});
// ── Auto refresh token on 401 ──
API.interceptors.response.use(
(res) => res,
async (err) => {
const original = err.config;
// If 401 and we haven't already retried, try refreshing the token
if (
err?.response?.status === 401 &&
!original._retry &&
localStorage.getItem("refresh")
) {
original._retry = true;
try {
const refreshRes = await axios.post(
`${import.meta.env.VITE_API_URL || "https://edtech-backend-f7p4.onrender.com/api"}/token/refresh/`,
{ refresh: localStorage.getItem("refresh") }
);
const newToken = refreshRes.data.access;
localStorage.setItem("token", newToken);
original.headers.Authorization = `Bearer ${newToken}`;
return API(original); // Retry original request with new token
} catch {
// Refresh failed — clear storage and let UI handle redirect
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