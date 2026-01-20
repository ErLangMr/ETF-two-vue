<template>
  <div class="position-details">
    <div style="text-align: right">
      <el-date-picker
        v-model="yearValue"
        type="year"
        :clearable="false"
        placeholder="选择年份"
        value-format="YYYY"
        @change="yearChange"
      />
    </div>
    <div>
      <header class="header">
        <h3>重仓明细</h3>
      </header>
      <h4>一季报</h4>
      <el-table
        :data="tableData1"
        :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
        :style="{ width: '100%' }"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        >
          <template #default="scope">
            <span v-if="column.prop === 'holdMv'">
              {{ formatValue(scope.row[column.prop], "million") }}
            </span>
            <span v-if="column.prop === 'reportType'">
              {{ formatReportType(scope.row[column.prop]) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage1"
          layout="total, prev, pager, next"
          :total="total1"
          @current-change="(val) => tab1handleCurrentChange(val, '1')"
        />
      </div>
      <div style="margin-top: 30px">
        <h4>三季报</h4>
        <el-table
          :data="tableData3"
          :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
          :style="{ width: '100%' }"
        >
          <el-table-column
            v-for="column in tableColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
          >
            <template #default="scope">
              <span v-if="column.prop === 'holdMv'">
                {{ formatValue(scope.row[column.prop], "million") }}
              </span>
              <span v-if="column.prop === 'reportType'">
                {{ formatReportType(scope.row[column.prop]) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: flex-end;margin-top: 10px;">
          <el-pagination
            :current-page="currentPage3"
            layout="total, prev, pager, next"
            :total="total3"
            @current-change="(val) => tab1handleCurrentChange(val, '3')"
          />
        </div>
      </div>
    </div>
    <div style="margin-top: 30px">
      <header class="header">
        <h3>全部明细</h3>
      </header>
      <h4>半年报</h4>
      <el-table
        :data="tableData5"
        :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
        :style="{ width: '100%' }"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        >
          <template #default="scope">
            <span v-if="column.prop === 'holdMv'">
              {{ formatValue(scope.row[column.prop], "million") }}
            </span>
            <span v-if="column.prop === 'reportType'">
              {{ formatReportType(scope.row[column.prop]) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage5"
          layout="total, prev, pager, next"
          :total="total5"
          @current-change="(val) => tab1handleCurrentChange(val, '5')"
        />
      </div>
      <h4 style="margin-top: 20px">年报</h4>
      <el-table
        :data="tableData6"
        :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
        :style="{ width: '100%' }"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        >
          <template #default="scope">
            <span v-if="column.prop === 'holdMv'">
              {{ formatValue(scope.row[column.prop], "million") }}
            </span>
            <span v-if="column.prop === 'reportType'">
              {{ formatReportType(scope.row[column.prop]) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage6"
          layout="total, prev, pager, next"
          :total="total6"
          @current-change="(val) => tab1handleCurrentChange(val, '6')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { getAnnualHoldingsApi } from "@/api/filterDetails.ts";
import { formatValue } from "@/utils/formatValue.ts";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  tabActiveName: {
    type: String,
    required: true,
  },
});

const yearValue = ref<string>((new Date().getFullYear() - 1).toString());

watch(
  () => props.tabActiveName,
  (tabActiveName) => {
    if (tabActiveName === "PositionDetail") {
      getAnnualHoldings();
    }
  }
);
const tableData1 = ref<Record<string, any>[]>([]);
const tableData3 = ref<Record<string, any>[]>([]);
const tableData5 = ref<Record<string, any>[]>([]);
const tableData6 = ref<Record<string, any>[]>([]);

const currentPage1 = ref<number>(1);
const total1 = ref<number>(0);
const currentPage3 = ref<number>(1);
const total3 = ref<number>(0);
const currentPage5 = ref<number>(1);
const total5 = ref<number>(0);
const currentPage6 = ref<number>(1);
const total6 = ref<number>(0);

const currentPageMap: Record<string, Ref<number>> = {
  '1': currentPage1,
  '3': currentPage3,
  '5': currentPage5,
  '6': currentPage6
};

const tableDataMap: Record<string, Ref<Record<string, any>[]>> = {
  '1': tableData1,
  '3': tableData3,
  '5': tableData5,
  '6': tableData6
};

const totalMap: Record<string, Ref<number>> = {
  '1': total1,
  '3': total3,
  '5': total5,
  '6': total6
};
const handleSizeChange1 = (val: number) => {
  currentPage1.value = val;
  // getAnnualHoldings();
};
const tab1handleCurrentChange = (val: number, type: string) => {
  const currentPageRef = currentPageMap[type];
  if (currentPageRef) {
    currentPageRef.value = val;
  }
  const obj = {
    etfCode: props.code,
    year: yearValue.value,
    reportType: type,
    pageSize: 10,
    pageNum: val,
  }
  getAnnualHoldingsApi(obj).then((res: any) => {
      const tableDataRef = tableDataMap[type];
      const totalRef = totalMap[type];
      if (tableDataRef && totalRef) {
        tableDataRef.value = res.content;
        totalRef.value = res.totalElements || 0;
      }
    });
};

const yearChange = (val: string) => {
  getAnnualHoldings();
};

const tableColumns = [
  { prop: "stkCode", label: "股票代码" },
  { prop: "stkName", label: "股票名称" },
  { prop: "reportType", label: "报告类型" },
  { prop: "holdNum", label: "持股数量（股）" },
  { prop: "holdMv", label: "持股市值（百万元）" },
  { prop: "date", label: "报告日期" },
];
function getAnnualHoldings() {
  const typeArr = ["1", "3", "5", "6"];
  typeArr.forEach((type) => {
    getAnnualHoldingsApi({
      etfCode: props.code,
      year: yearValue.value,
      reportType: type,
      pageSize: 10,
      pageNum: 1
    }).then((res: any) => {
      const tableDataRef = tableDataMap[type];
      const totalRef = totalMap[type];
      if (tableDataRef && totalRef) {
        tableDataRef.value = res.content;
        totalRef.value = res.totalElements || 0;
      }
    });
  });
}
function formatReportType(type: string) {
  const reportTypeMap: Record<string, string> = {
    "1": "一季报",
    "3": "三季报",
    "5": "半年报",
    "6": "年报",
  };
  return reportTypeMap[type] ?? "其他";
}
</script>

<style lang="scss" scoped>
.position-details {
  .header {
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
}
</style>
