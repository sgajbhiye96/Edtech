import axios from "axios";

const API = axios.create({

  baseURL: import.meta.env.VITE_API_URL || "https://edtech-backend-f7p4.onrender.com/api",

});

// Auto attach token

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {

    req.headers.Authorization = `Bearer ${token}`;

  }

  return req;

});

export default API;
 