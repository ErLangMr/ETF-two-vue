import { get, post } from '@/utils/request'

/**
 * 获取对比工具-概览数据
 * @param data
 */
export const getCompareOverviewApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/overview', data)
}

/**
 * 获取对比工具-净值数据
 * @param data
 */
export const getCompareNetValueApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/net-value', data)
}

/**
 * 获取对比工具-资金流向数据
 * @param data
 */
export const getCompareFundFlowApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/fund-flow', data)
}

/**
 * 获取对比工具-费用数据
 * @param data
 */
export const getCompareFeeApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/fee', data)
}

/**
 * 获取对比工具-交易效率数据
 * @param data
 */
export const getCompareTradingEfficiencyApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/trading-efficiency', data)
}

/**
 * 获取对比工具-分红数据
 * @param data
 */
export const getCompareDividendApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/dividend', data)
}

/**
 * 获取对比工具-风险数据
 * @param data
 */
export const getCompareRiskApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/risk', data)
}

/**
 * 获取对比工具-持仓特征数据
 * @param data
 */
export const getCompareHoldingFeatureApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/holding-feature', data)
}

/**
 * 获取对比工具-估值数据
 * @param data
 */
export const getCompareValuationApi = (data: Record<string, any>) => {
  return post<Record<string, any>[]>('/api/compare/valuation', data)
}

// 深度对比

/**
 * 获取对比工具-深度对比-两个ETF数据
 * @param data
 */
export const getDeepCompareTwoEtfApi = (params: Record<string, any>) => {
  return get<Record<string, any>>('/api/deep/compare/two-etf', params)
}

/**
 * 获取对比工具-深度对比-ETF行业占比差异图表数据
 * @param data
 */
export const getDeepCompareIndustryChartApi = (params: Record<string, any>) => {
  return get<Record<string, any>>('/api/deep/compare/industry/chart', params)
}
