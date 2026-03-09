import { get, post } from "@/utils/request";

export const getLeftChartDataApi = () => {
  return get("/api/funds/getAllETFScales");
};

export const getRightChartDataApi = () => {
  return get("/api/funds/get300ETFScales");
};

export const getTop3PopularIndicesApi = () => {
  return get("/api/funds/getTop3PopularIndices");
};

export const incrementViewCountApi = () => {
  return post("/api/count/increment");
};
