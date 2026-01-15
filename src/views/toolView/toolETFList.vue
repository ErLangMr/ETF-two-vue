<template>
  <div class="tool-etf-list-container">
    <h1>{{ index.trackIndexName }} 相关ETF</h1>
    <div class="list-container">
      <h2>ETF 概览</h2>
      <div class="list-box">
        <ScreenerTable
          class="table-area"
          :table-data="etfList"
          :hasTableFilter="true"
          @tableFilterTab="handleTableFilterTab">
          <template #table-pagination>
            <el-pagination
              v-model:current-page="page"
              layout="total, prev, pager, next"
              :pager-count="!isMobile() ? 7 : 3"
              :total="total"
              :page-size="pageSize"
              @current-change="handlePageChange" />
          </template>
        </ScreenerTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScreenerTable from '@/components/ScreenerTable.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import { getFilterTableApi } from "@/api/filterTable";
import { useDevice } from "@/utils/device";
import { getEtfOverviewPageApi, getEtfNetValuePageApi, getEtfFundFlowPageApi, getEtfFeePageApi, getEtfTradingEfficiencyPageApi, getEtfDividendPageApi, getEtfRiskPageApi, getEtfHoldingFeaturePageApi, getEtfValuationPageApi } from "@/api/filterTable";

const route = useRoute();
const index = JSON.parse(route.query.index as string || '{}');

const { isMobile } = useDevice();

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  getEtfTableData();
};

const etfList = ref<any[]>([])
let paramsObj: Record<string, any> = {
  codes: index.codes,
}
// 顶部筛选Tab变化，获取表格数据
const tableFilterTabVal = ref("overview");
function handleTableFilterTab(tab: string) {
  tableFilterTabVal.value = tab;
  getEtfTableData(paramsObj)
}

function getEtfTableData(params?: Record<string, any>) {
  const obj = {
    page: page.value,
    size: pageSize.value,
    ...params
  }
  if( tableFilterTabVal.value === 'overview'){
    getEtfOverviewPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'returns'){
    getEtfNetValuePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'fundFlows'){
    getEtfFundFlowPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  }else if( tableFilterTabVal.value === 'expenses'){
    getEtfFeePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'efficiency'){
    getEtfTradingEfficiencyPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'dividends'){
    getEtfDividendPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'risk'){
    getEtfRiskPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTabVal.value === 'holdings'){
    getEtfHoldingFeaturePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
  } else if( tableFilterTabVal.value === 'valuation'){
    getEtfValuationPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
  }
}
onMounted(() => {
  getEtfTableData(paramsObj);
});
</script>

<style scoped lang="scss">
.tool-etf-list-container{
  width: 100%;
  padding: 20px;
  .list-container{
    width: 100%;
    height: 100%;
  }
}
</style>
