import { get, post } from '@/utils/request'

// a to z
export const getETFAtoZApi = () => {
  return get('/api/funds/byType/getAtoZ')
}

// aum
export const getETFAumApi = () => {
  return get('/api/funds/byType/getAum')
}

// 费用
export const getETFExpenseApi = () => {
  return get('/api/funds/byType/getExpense')
}

// 资金流动
export const getETFFundFlowApi = () => {
  return get('/api/funds/byType/getFundFlow')
}

// 收益
export const getETFReturnApi = () => {
  return get('/api/funds/byType/getRetruns')
}

// 发行人收入
export const getETFIssuerRevenueApi = () => {
  return get('/api/funds/byType/getIssuerRevenue')
}


// 分红
export const getETFDividendApi = () => {
  return get('/api/funds/byType/getDividend')
}
