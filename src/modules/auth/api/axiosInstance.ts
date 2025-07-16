import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = Config.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    config.headers.set
      ? config.headers.set("Authorization", `Bearer ${token}`)
      : (config.headers["Authorization"] = `Bearer ${token}`);
  }
  return config;
});

export default axiosInstance;