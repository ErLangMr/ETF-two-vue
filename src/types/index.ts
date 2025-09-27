// 路由相关类型
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 用户信息类型
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

// 分页请求参数类型
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ETF相关类型
export interface ETFInfo {
  id: string;
  name: string;
  symbol: string;
  issuer: string;
  expenseRatio: number;
  assets: number;
}

// 图表数据类型
export interface ChartData {
  date: string;
  value: number;
}

// 工具函数类型
export type FormatFunction = (value: number) => string;