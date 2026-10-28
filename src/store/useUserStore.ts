import { create } from "zustand";
import { getUserInfo, logout } from "@api/user";
import type { IUserInfo } from "../types";
const AUTH_HOST = import.meta.env.VITE_AUTH_HOST || "";

interface UserState {
  userInfo: IUserInfo | null;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,

  fetchUserInfo: async () => {
    try {
      // 假设你用 '/auth-api' 代理到了认证中心
      const res = await getUserInfo();
      set({ userInfo: res.data });
    } catch (error) {
      console.error("获取用户信息失败", error);
    }
  },

  logout: async () => {
    try {
      await logout();
      set({ userInfo: null });
      localStorage.removeItem("accessToken");
      window.location.href = `${AUTH_HOST}/login?type=logout&appId=docs&redirect=${window.location.href}`;
    } catch (error) {
      console.log("退出接口错误", error);
    }
  },
}));
