import { get, post } from '@/utils/request'

/**
 * 获取ETF快照-基本信息
 * @param params
 * @returns
 */
export const getSnapshotInfoApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/snapshot', params)
}

/**
 * 获取ETF快照-折线图数据
 * @param params
 * @returns
 */
export const getSnapshotLineApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/snapshot/line', params)
}

/**
 * 获取ETF快照-收益数据
 * @param params
 * @returns
 */
export const getSnapshotReturnsApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/snapshot/returns', params)
}


/**
 * 获取基础资料-行业数据
 * @param params
 * @returns
 */
export const getBaseInfoIndustryApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/industry', params)
}
/**
 * 获取基础资料-图表数据
 * @param params
 * @returns
 */
export const getBaseInfoChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/aum-shares-chart', params)
}



/**
 * 获取效率和成本-基础数据
 * @param params
 * @returns
 */
export const getEfficiencyAndCostInfoApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/efficiency-cost', params)
}

/**
 * 获取效率和成本-折线图数据
 * @param params
 * @returns
 */
export const getEfficiencyAndCostLineApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/monthly-tracking-error-chart', params)
}
