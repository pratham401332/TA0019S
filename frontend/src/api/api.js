import axios from "axios";

const API = axios.create({
  // We point this to your specific Render backend URL
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://ta0019sbackend.onrender.com/api",
});

export default API;