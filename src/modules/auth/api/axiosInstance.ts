import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = Config.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  console.log('Full URL:', (config.baseURL || '') + (config.url || ''));
  
  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    config.headers.set
      ? config.headers.set("Authorization", `Bearer ${token}`)
      : (config.headers["Authorization"] = `Bearer ${token}`);
  }
  return config;
});

export default axiosInstance;