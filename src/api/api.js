import axios from "axios";

const api = axios.create({
  baseURL: "https://afbros-backend.onrender.com/api",
});

export default api;