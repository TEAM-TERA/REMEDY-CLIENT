import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

// iOS 시뮬레이터용 localhost 주소 (백엔드 서버가 로컬에서 실행 중인 경우)
const API_BASE_URL = 'http://10.150.0.189:8081/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
  console.log('📡 Full URL:', (config.baseURL || '') + (config.url || ''));
  
  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    config.headers.set
      ? config.headers.set("Authorization", `Bearer ${token}`)
      : (config.headers["Authorization"] = `Bearer ${token}`);
  }
  return config;
});

export default axiosInstance;