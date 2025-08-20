import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

// 임시로 하드코딩된 URL 사용 (나중에 환경변수로 변경)
const API_BASE_URL = 'http://10.150.0.189:8081/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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