import { get, post } from '@/utils/request'

/**
 * 获取股票列表1
 * @param data
 */
export const getStockList1Api = (data: any) => {
  return post('/api/stock/list1', data)
}

/**
 * 获取股票列表2
 * @param data
 */

export const getStockList2Api = (data: any) => {
  return post('/api/stock/list2', data)
}
