import { get, post } from '@/utils/request'
// 跟踪指数模块接口
/**
 * 获取概览页面数据
 * @param data
 * @returns
 */
export const getOverviewPageApi = (data: Record<string, any>) => {
  return post(`/api/index/overview/page/`, data);
};

/**
 * 获取收益数据
 * @param data
 * @returns
 */

export const getNetValuePageApi = (data: Record<string, any>) => {
  return post(`/api/index/net-value/page`, data);
};

/**
 * 获取分红数据
 * @param data
 * @returns
 */
export const getDividendPageApi = (data: Record<string, any>) => {
  return post(`/api/index/dividend/page`, data);
};

/**
 * 获取风险数据
 * @param data
 * @returns
 */
export const getRiskPageApi = (data: Record<string, any>) => {
  return post(`/api/index/risk/page`, data);
};

/**
 * 获取持仓特征数据
 * @param data
 * @returns
 */
export const getHoldingFeaturePageApi = (data: Record<string, any>) => {
  return post(`/api/index/holding-feature/page`, data);
};

/**
 * 获取估值数据
 * @param data
 * @returns
 */
export const getValuationPageApi = (data: Record<string, any>) => {
  return post(`/api/index/valuation/page`, data);
};

/**
 * 获取相关数据
 * @param data
 * @returns
 */
export const getRelatedPageApi = (data: Record<string, any>) => {
  return post(`/api/index/related/page`, data);
};

// 跟踪指数详情模块接口

/**
 * 获取指数详情-快照数据
 * @param data
 * @returns
 */
export const getIndexSnapshotApi = (params: Record<string, any>) => {
  return get<Record<string, any>>(`/api/index/info/snapshot`, params);
};

/**
 * 获取指数详情-指数特征数据
 * @param data
 * @returns
 */
export const getIndexCharacteristicsApi = (params: Record<string, any>) => {
  return get<Record<string, any>>(`/api/index/info/characteristics`, params);
};


/**
 * 获取指数详情-交易数据
 * @param data
 * @returns
 */
export const getIndexTransactionApi = (params: Record<string, any>) => {
  return post<Record<string, any>>(`/api/index/info/transaction`, params);
};

/**
 * 获取指数详情-分红数据-基本面
 * @param data
 * @returns
 */
export const getIndexDividendFundamentalsApi = (params: Record<string, any>) => {
  return post<Record<string, any>>(`/api/index/info/dividends/fundamentals`, params);
};
