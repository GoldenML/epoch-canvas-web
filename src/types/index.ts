export interface IResultList<T> {
  code: number;
  data: T[];
  msg: string;
}
export interface IResult<T> {
  code: number;
  data: T;
  msg: string;
}
export interface IPageList<T> {
  code: number;
  data: {
    list: T[];
    total: number;
  };
  msg: string;
}

export interface IUserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  gender?: number;
  email?: string;
  phone?: string;
  created_at?: string;
}
