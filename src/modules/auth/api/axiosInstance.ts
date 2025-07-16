import axios from "axios";
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;