import type { FC } from "react";

export interface AnimationMeta {
  id: string; // 唯一标识，如 'bouncing-ball'
  title: string; // 标题
  description: string; // 描述
  component: FC; // 实际渲染的 Canvas 动画组件
  code: string; // 源码字符串（用于代码展示）
  thumbnail?: string; // 静态缩略图URL（可选，如果不用实时渲染）
}
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
