import { get } from "@/utils/request";

export const getPopularIndicesApi = (type: string) => {
  return get(`/api/funds/getPopularIndices/${type}`);
};