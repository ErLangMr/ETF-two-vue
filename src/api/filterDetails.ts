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


/**
 * 获取分红和估值-基础数据
 * @param params
 * @returns
 */
export const getDividendAndValuationApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/dividend-valuation', params)
}

/**
 * 获取业绩表现-表格数据数据
 * @param params
 * @returns
 */
export const getPerformanceListApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/performance', params)
}

/**
 * 获取业绩表现-柱形图数据
 * @param params
 * @returns
 */
export const getPerformanceBarApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/performance/bar', params)
}

/**
 * 获取业绩表现-折线图数据
 * @param params
 * @returns
 */
export const getPerformanceLineApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/performance/line', params)
}

/**
 * 获取风险度量-基础数据
 * @param params
 * @returns
 */
export const getRiskIndicatorInfoApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/risk-metrics', params)
}

/**
 * 获取资金流动-资金净流入额图表数据
 * @param params
 * @returns
 */
export const getFundFlowChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/fund-flow/chart', params)
}

/**
 * 获取资金流动-规模变化净值涨跌影响图表数据
 * @param params
 * @returns
 */
export const getScaleAndPriceChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/scale-price/chart', params)
}


/**
 * 获取持仓明细-基础数据
 * @param params
 * @returns
 */
export const getAnnualHoldingsApi = (params: any) => {
  return get<Record<string, any>[]>('/api/etf/holdings', params)
}

/**
 * 获取投资组合特征-图表数据
 * @param params
 * @returns
 */
export const getPortfolioChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/portfolio/chart', params)
}


/**
 * 获取持仓分析-列表数据
 * @param params
 * @returns
 */
export const getHoldingAnalysisListApi = (params: any) => {
  return get<Record<string, any>[]>('/api/etf/holding/analysis', params)
}
/**
 * 获取持仓分析GICS数据-图表数据
 * @param params
 * @returns
 */
export const getGICSLevel1ChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/gics/level1/chart', params)
}
/**
 * 获取持仓分析GICS-level3数据-图表数据
 * @param params
 * @returns
 */
export const getGICSLevel3ChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/gics/level3/chart', params)
}
/**
 * 获取持仓分析ICB数据-图表数据
 * @param params
 * @returns
 */
export const getICBLevel1ChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/icb/level1/chart', params)
}
/**
 * 获取持仓分析ICB-level3数据-图表数据
 * @param params
 * @returns
 */
export const getICBLevel3ChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/icb/level3/chart', params)
}
/**
 * 获取持仓分析-投资区域数据-图表数据
 * @param params
 * @returns
 */
export const getAreaChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/area/chart', params)
}

/**
 * 获取持仓行为分析-列表数据
 * @param params
 * @returns
 */
export const getHoldingChangeTop5Api = (params: any) => {
  return get<Record<string, any>>('/api/etf/holding/change/top5', params)
}

/**
 * 获取持仓行为分析-ETF持股市值占比图表数据
 * @param params
 * @returns
 */
export const getMVRatioChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/mv-ratio', params)
}

/**
 * 获取持持仓行为分析-ETF地区占比变化图-图表数据
 * @param params
 * @returns
 */
export const getAreaRatioChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/area/ratio/chart', params)
}

/**
 * 获取持仓行为分析-ETF GICS 一级行业配置变化图数据
 * @param params
 * @returns
 */
export const getGICSRatioChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/gics/ratio/chart', params)
}

/**
 * 获取持仓行为分析-ETF IBC 一级行业配置变化图数据
 * @param params
 * @returns
 */
export const getICBRatioChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/ibc/ratio/chart', params)
}


/**
 * 获取持有人行为分析-持有人行为数据
 * @param params
 * @returns
 */
export const getHolderBehaviorApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/holder/behavior', params)
}

/**
 * 获取持有人行为分析-不同类型持有人行为数据-图表数据
 * @param params
 * @returns
 */
export const getHolderBehaviorCategoryChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/behavior/category/chart', params)

}

/**
 * 获取持有人行为分析-不同风格持有人行为数据-图表数据
 * @param params
 * @returns
 */
export const getHolderBehaviorStyleChartApi = (params: any) => {
  return get<Record<string, any>>('/api/etf/behavior/style/chart', params)
}
