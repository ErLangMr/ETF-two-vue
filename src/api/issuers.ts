import { get } from '@/utils/request'

export const getIssuerRevenueApi = () => {
  return get('/api/funds/byIssuer/getIssuerRevenue')
}

export const getIssuerFundFlowApi = () => {
  return get('/api/funds/byIssuer/getFundFlow')
}

export const getIssuerReturnApi = () => {
  return get('/api/funds/byIssuer/getReturn')
}

export const getIssuerAumApi = () => {
  return get('/api/funds/byIssuer/getAum')
}

export const getIssuerExpenseApi = () => {
  return get('/api/funds/byIssuer/getExpense')
}

export const getIssuerDividendApi = () => {
  return get('/api/funds/byIssuer/getDividend')
}

export const getIssuerNetInflowApi = (params: any) => {
  return get('/api/funds/by-code/net-inflow/four', params)
}