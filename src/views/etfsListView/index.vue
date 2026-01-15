<template>
  <div class="etf-list-container">
    <div class="etf-list-header">
      <h1 class="etf-list-title"><span>{{  categoryList.find(item => item.value === issue.category)?.label }}</span> ETF 列表</h1>
      <!-- <p class="etf-list-desc">
        Alternatives ETFs offer exposure to the alternatives asset class. There are various alternative classifications, including hedge fund, long/short, managed futures and a few others. Alternatives, or "alts" for short, refers to investments that fall outside of the conventional asset class buckets, which are stocks, bonds, and cash. These types of investments are usually difficult to access for retail investors because they are more complex to understand, typically require some sort of minimum investment, have nuanced fee structures, are less liquid, and are generally seen as "riskier" by non-professionals. Some of the most popular types of alternatives are:
      </p> -->
    </div>
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
const issue = JSON.parse(route.query.theme as string || '{}');

const { isMobile } = useDevice();
const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  getEtfTableData(paramsObj)
};

// const getFilterTableData = async () => {
//   const obj = {
//     page: page.value,
//     pageSize: pageSize.value,
//     codes: issue.codes,
//   }
//   const res: any = await getFilterTableApi(obj);
//   etfList.value = res.content
//   total.value = res.totalElements
// };

const etfList = ref<any[]>([])
let paramsObj: Record<string, any> = {
  codes: issue.codes,
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
.etf-list-container{
  width: 100%;
  height: 100%;
  padding: 20px;
}
.etf-list-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  span{
    font-size: 2.1rem;
  }
}
.etf-list-desc {
  font-size: 1.08rem;
  color: #222;
  margin-bottom: 1.1rem;
  line-height: 1.7;
}
.list-container{
  .list-box{
  //  border: 1px solid #ccc;
   border-radius: 5px;
  }
}
</style>

