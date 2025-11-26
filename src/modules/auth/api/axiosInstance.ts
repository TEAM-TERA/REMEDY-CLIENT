// src/services/http/axiosInstance.ts
import axios from "axios";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "../../../../App";
import * as RootNavigation from "../../../navigation/index";

const API_BASE_URL = Config.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(async (config) => {
  const isLikeApi = config.url?.includes('/my-like');

  if (isLikeApi) {
    console.log("🔥 [DEBUG] 좋아요 API Request:", config.method?.toUpperCase(), config.url);
    console.log("🔥 [DEBUG] Full URL:", (config.baseURL || "") + (config.url || ""));
  } else {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Full URL:", (config.baseURL || "") + (config.url || ""));
  }

  const token = await AsyncStorage.getItem("userToken");
  if (isLikeApi) {
    console.log("🔥 [DEBUG] Token:", token ? 'exists' : 'missing');
  }

  if (token && config.headers) {
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    const isLikeApi = res.config.url?.includes('/my-like');
    if (isLikeApi) {
      console.log("🔥 [DEBUG] 좋아요 API Response 성공:", res.status, res.data);
    }
    return res;
  },
  async (error) => {
    const isLikeApi = error.config?.url?.includes('/my-like');
    if (isLikeApi) {
      console.log("🔥 [DEBUG] 좋아요 API Response 에러:", error.response?.status, error.response?.data);
    }
    const originalRequest = error.config;
    
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        
        if (refreshToken) {
          console.log("토큰 갱신 시도...");
          
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          await AsyncStorage.setItem("userToken", accessToken);
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
          
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          
          console.log("토큰 갱신 성공");
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.log("토큰 갱신 실패:", refreshError);
      }
      
      console.log("로그아웃 처리 중...");
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("refreshToken");
      delete axiosInstance.defaults.headers.common["Authorization"];

      queryClient.clear();

      RootNavigation.navigate("Auth");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
