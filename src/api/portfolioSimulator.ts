import { post } from "@/utils/request"

// 组合模拟器

/**
 * 组合模拟器-获取组合信息
 */
export const getPortfolioSimulatorInfoApi = (etfCodes: string[]) => {
  return post<Record<string, any>>('/api/combination/getInfo', etfCodes)
}

/**
 * 组合模拟器-etf组合全维度计算
 */
export const getPortfolioSimulatorCalculateApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/calculate', data)
}

/**
 * 组合模拟器-获取组合收益波动率与风险指标
 */
export const getPortfolioSimulatorReturnVolApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/return-vol', data)
}
/**
 * 组合模拟器-获取组合持股明细
 */
export const getPortfolioSimulatorHoldingsApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/holdings', data)
}

/**
 * 组合模拟器-获取组合持股明细
 */
export const getPortfolioSimulatorCapDistributionApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/cap-distribution', data)
}

/**
 * 组合模拟器-获取组合行业分布
 */
export const getPortfolioSimulatorIndustryDistributionApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/industry-distribution', data)
}

/**
 * 组合模拟器-获取组合地区分布
 */
export const getPortfolioSimulatorAreaDistributionApi = (data: Record<string, any>) => {
  return post<Record<string, any>>('/api/combination/area-distribution', data)
}
