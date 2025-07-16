import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
  // ...공통 헤더, 인터셉터 등
});

export default axiosInstance;