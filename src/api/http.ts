import Axios from "axios";
import { message } from "antd"; // 👈 替换 Element Plus

// 认证中心地址。认证中心自身为空，业务应用为 https://auth.xxx.com
const AUTH_HOST = import.meta.env.VITE_AUTH_HOST || "";
const APP_ID = import.meta.env.VITE_APP_ID || "";

const http = Axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

http.interceptors.request.use((config) => {
  // 在 React 中，直接从 localStorage 读取 Token 最稳，避免跨组件拿状态报错
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 💡 如果是 FormData，删掉默认的 Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

let redirecting = false; // 防止 401 并发导致重复跳转

http.interceptors.response.use(
  (response) => {
    const { data } = response;
    // 💡 使用 Antd 的 message 替换 ElMessage
    if (data.code !== 200) {
      message.error(data.msg || "请求失败");
      throw new Error(data.msg);
    }

    return data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !redirecting) {
      redirecting = true;
      message.error("登录已过期，请重新登录");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      const back = encodeURIComponent(location.href);

      setTimeout(() => {
        window.location.href = `${AUTH_HOST}login?appId=${APP_ID}&redirect=${back}`;
      }, 0);
    }

    return Promise.reject(error);
  },
);

export default http;
