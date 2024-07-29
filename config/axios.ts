import { BaseResponse } from "@/models";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1111",
  headers: {
    "Content-Type": "application/json",
    "x-auth-secret": "fiqriardiansyah",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    return {
      ...config,
    };
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const baseResponse = error?.response?.data as BaseResponse<any>;
    return Promise.reject(
      baseResponse?.error ? Error(baseResponse?.error) : error
    );
  }
);

export default api;
