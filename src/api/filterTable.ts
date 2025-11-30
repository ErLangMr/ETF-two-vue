import { get, post } from '@/utils/request'

export const getFilterTableApi = (params: Record<string, any>) => {
  return post('/api/funds/by-category', params)
}

export const getTypeByCategoryApi = (type: string, category?: string) => {
  return get('/api/funds/by-category/getTypeByCategory', {type,category,})
}

export const getEtfFilterDataApi = () => {
  return get('/api/etf/etfTree')
}

/**
 * 获取etf overview分页数据
 * @param params
 */
export const getEtfOverviewPageApi = (data: Record<string, any>) => {
  return post('/api/etf/overview/page', data)
}

/**
 * 获取etf 净值收益分页数据
 * @param params
 */
export const getEtfNetValuePageApi = (data: Record<string, any>) => {
  return post('/api/etf/net-value/page', data)
}

/**
 * 获取etf 资金流动分页数据
 * @param params
 */
export const getEtfFundFlowPageApi = (data: Record<string, any>) => {
  return post('/api/etf/fund-flow/page', data)
}

/**
 * 获取etf 费用分页数据
 * @param params
 */
export const getEtfFeePageApi = (data: Record<string, any>) => {
  return post('/api/etf/fee/page', data)
}
/**
 * 获取etf 交易效率分页数据
 * @param params
 */
export const getEtfTradingEfficiencyPageApi = (data: Record<string, any>) => {
  return post('/api/etf/trading-efficiency/page', data)
}
/**
 * 获取etf分红分页数据
 * @param params
 */
export const getEtfDividendPageApi = (data: Record<string, any>) => {
  return post('/api/etf/dividend/page', data)
}
/**
 * 获取etf 风险指标分页数据
 * @param params
 */
export const getEtfRiskPageApi = (data: Record<string, any>) => {
  return post('/api/etf/risk/page', data)
}
/**
 * 获取etf 持仓特征分页数据
 * @param params
 */
export const getEtfHoldingFeaturePageApi = (data: Record<string, any>) => {
  return post('/api/etf/holding-feature/page', data)
}
// /**
//  * 获取etf 资金流动分页数据
//  * @param params
//  */
// export const getEtfFundFlowPageApi = (data: Record<string, any>) => {
//   return post('/api/etf/fund-flow/page', data)
// }
// /**
//  * 获取etf 资金流动分页数据
//  * @param params
//  */
// export const getEtfFundFlowPageApi = (data: Record<string, any>) => {
//   return post('/api/etf/fund-flow/page', data)
// }

