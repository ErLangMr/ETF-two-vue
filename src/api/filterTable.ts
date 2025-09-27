import { get, post } from '@/utils/request'

export const getFilterTableApi = (params: Record<string, any>) => {
  return post('/api/funds/by-category', params)
}

export const getTypeByCategoryApi = (type: string, category?: string) => {
  return get('/api/funds/by-category/getTypeByCategory', {type,category,})
}
