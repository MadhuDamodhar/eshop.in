// axios-helper.js
import axios from "axios";
import { getToken } from "../Auth"; // Adjust import path as needed

export const BASE_URL = "http://localhost:9090";

export const PrivateHttp = axios.create({
  baseURL: BASE_URL,
});

// Add token in header
PrivateHttp.interceptors.request.use(
  (request) => {
    let token = getToken();
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);
