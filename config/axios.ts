import { BaseResponse } from "@/models";
import axios from "axios";
import cookie from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
    "x-auth-secret": process.env.NEXT_PUBLIC_SECRET,
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Credentials": true,
    "Authorization": cookie.get("authjs.session-token"),
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    return {
      ...config,
    };
  },
  (error) => {
    return Promise.reject(error)
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const baseResponse = error?.response?.data as BaseResponse<any>;
    return Promise.reject(baseResponse?.error ? Error(baseResponse?.error) : error)
  }
);

export default api;
