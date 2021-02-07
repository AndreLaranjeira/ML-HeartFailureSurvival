// Package imports.
import axios from "axios";

// API.
const api = axios.create({
  baseURL: "http://localhost:3333"
});

// Export module.
export default api;
