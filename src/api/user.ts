import type { IResult, IUserInfo } from "../types";
import http from "./http";

export const getUserInfo = (): Promise<IResult<IUserInfo>> => {
  return http.get("/oauth/userInfo");
};
export const logout = (): Promise<IResult<IUserInfo>> => {
  return http.post("/oauth/logout");
};
