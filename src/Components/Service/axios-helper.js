import axios from "axios";
import { getToken } from "../Auth";

// export const BASE_URL = "http://3.80.57.207:9003";
export const BASE_URL = "http://172.20.10.10:9003";
export const PrivateHttp = axios.create({
  baseURL: BASE_URL,
});

// Add token in header
PrivateHttp.interceptors.request.use(
  (request) => {
    let token = getToken();
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);
