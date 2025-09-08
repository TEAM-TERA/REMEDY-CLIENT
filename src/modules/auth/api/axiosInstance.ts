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
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  console.log("Full URL:", (config.baseURL || "") + (config.url || ""));

  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      delete axiosInstance.defaults.headers.common["Authorization"];

      queryClient.clear();

      RootNavigation.navigate("Auth");

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
