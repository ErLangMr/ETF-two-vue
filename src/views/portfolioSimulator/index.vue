<template>
  <div class="portfolio-simulator">
    <div class="page-header">
      <h1>ETF组合模拟器</h1>
    </div>
    <div v-if="etfCodes">
      <div class="config-ratio-box">
        <div class="section-title">配置比例</div>
        <p style="display: flex; justify-content: space-between">
          <span>配置比例不得低于或高于100%。</span>
          <el-date-picker
            v-model="dayValue"
            type="date"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </p>
        <div class="ratio-container" v-loading="codeInfoLoading">
          <div
            class="etf-ratio-item"
            v-for="(etf, index) in etfList"
            :key="etf.code"
          >
            <div
              class="etf-close-btn"
              @click="removeETF(index)"
              v-if="etfList.length > 2"
            >
              <span>×</span>
            </div>
            <div class="etf-info">
              <div class="etf-code">{{ etf.code }}</div>
              <div class="etf-name">{{ etf.name }}</div>
            </div>
            <div class="etf-details">
              <div class="detail-item">
                <div class="label">费率</div>
                <div class="value">{{ etf.expenseRatio }}</div>
              </div>
              <div class="detail-item">
                <div class="label">ETF 评分</div>
                <div class="value">--</div>
              </div>
            </div>
            <div class="ratio-control">
              <div class="slider-wrapper">
                <el-slider v-model="etf.ratio" :min="0" :max="100" />
              </div>
              <div class="ratio-input">
                <el-input-number
                  v-model="etf.ratio"
                  :min="0"
                  :max="100"
                  :controls="false"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="ratio-footer">
          <el-button
            type="primary"
            class="analyze-btn"
            :disabled="totalRatio > 100 || totalRatio < 100"
            @click="handleAnalyzeClick"
            >分 析</el-button
          >
          <div class="total-ratio" :class="{ 'ratio-error': totalRatio > 100 }">
            {{ totalRatio }} %
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div style="padding: 20px">
        <QuickFacts
          :facts="facts"
          :loading="quickFactLoading"
          title="成本"
        ></QuickFacts>
        <div style="height: 30px"></div>
        <!-- <Performance /> -->
        <div>
          <el-table
            :data="tableData"
            v-loading="tableLoading"
            :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
            :style="{ width: '100%', margin: '20px 0' }"
          >
            <el-table-column
              :prop="column.prop"
              :label="column.label"
              v-for="column in tableColumn2"
              :key="column.prop"
            >
              <template #default="{ row }">
                <span
                  v-if="column.prop === 'dataLabel'"
                  >{{ row[column.prop] }}</span
                >
                <span v-else :style="{ color: styleColor(row[column.prop]) }">
                  {{ row[column.prop] ? Number(row[column.prop]).toFixed(4) : '--' }}
                  <span v-if="row[column.prop]">%</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div style="height: 30px"></div>
        <div>
          <div class="block">
            <div class="section-title">组合风险</div>
            <div class="info-list" v-loading="tableLoading">
              <div class="info-row">
                <span>过去5日波动率</span
                ><span class="linkStyle">{{ formatValue(portfolioRisk.vol5d) }}</span>
              </div>
              <div class="info-row">
                <span>过去20日波动率</span
                ><span class="linkStyle">{{ formatValue(portfolioRisk.vol20d) }}</span>
              </div>
              <div class="info-row">
                <span>过去50日波动率</span>
                <span class="linkStyle">{{ formatValue(portfolioRisk.vol50d) }}</span>
              </div>
              <div class="info-row">
                <span>过去200日波动率</span>
                <span class="linkStyle">{{ formatValue(portfolioRisk.vol200d) }}</span>
              </div>
              <div class="info-row">
                <span>Beta</span>
                <span class="linkStyle">{{ formatValue(portfolioRisk.beta) }}</span>
              </div>
              <div class="info-row">
                <span>标准差</span>
                <span class="linkStyle">{{ formatValue(portfolioRisk.std) }}</span>
              </div>
              <div class="info-row">
                <span>夏普比率</span>
                <span class="linkStyle">{{ formatValue(portfolioRisk.sharpeRatio) }}</span>
              </div>
            </div>
          </div>
        </div> -->
        <div style="height: 30px"></div>
        <!-- <AnalystOpinions /> -->
        <div style="height: 30px"></div>
        <ComboPositionFeature :etfList="etfList" :dayValue="dayValue" v-model:analyzeBtnClick="analyzeBtnClick" />
      </div>
    </div>
    <div v-else>
      <el-empty description="请选择ETF代码">
        <el-button
          type="primary"
          @click="() => router.push({ name: 'screener' })"
          >跳转到筛选器</el-button
        >
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePortfolioSimulatorStore } from "@/store/portfolioSimulator";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { formatValue } from "@/utils/formatValue";
import QuickFacts from "@/components/QuickFacts.vue";
import Performance from "@/views/detailsView/components/Performance.vue";
import AnalystOpinions from "./details/AttributionAnalysis.vue";
import ComboPositionFeature from "./details/comboPositionFeature.vue";
import {
  getPortfolioSimulatorCalculateApi,
  getPortfolioSimulatorInfoApi,
  getPortfolioSimulatorReturnVolApi,
} from "@/api/portfolioSimulator";
const router = useRouter();
const route = useRoute();

const etfCodes = route.query.ETFCodes as string;
const etfCodeList = etfCodes && etfCodes.split(",");
interface ETFItem {
  code: string;
  name: string;
  expenseRatio: string;
  esgScore: string;
  ratio: number;
}

const etfList = ref<ETFItem[]>([]);
const dayValue = ref(new Date().toISOString().slice(0, 10));

const portfolioSimulatorStore = usePortfolioSimulatorStore();
onMounted(() => {
  getPortfolioSimulatorInfo();
});
const codeInfoLoading = ref(false);
// 获取组合模拟信息
function getPortfolioSimulatorInfo() {
  if (!etfCodeList || etfCodeList.length === 0) return;
  codeInfoLoading.value = true;
  getPortfolioSimulatorInfoApi(etfCodeList)
    .then((res) => {
      if (res.code === 200) {
        etfList.value = res.data.etfBasicInfos.map(
          (item: Record<string, any>) => ({
            code: item.etfCode,
            name: item.etfName,
            expenseRatio: item.comprehensiveFee,
            esgScore: "--",
            ratio: 0,
          })
        );
      }
    })
    .finally(() => {
      codeInfoLoading.value = false;
    });
}
function handleDateChange() {
  console.log(dayValue.value);
}
const totalRatio = computed(() => {
  return etfList.value.reduce((sum, etf) => sum + etf.ratio, 0);
});

const removeETF = (index: number) => {
  if (etfList.value.length <= 2) return;
  etfList.value.splice(index, 1);
};
const quickFactLoading = ref(false);
const facts = ref([
  { label: "加权平均管理费率", value: "0%" },
  {
    label: "加权平均托管费率",
    value: "0%",
  },
  { label: "加权平均总成本", value: "0%" },
]);

const etfCodesParams: string[] = [];
const weightsParams: number[] = [];
const analyzeBtnClick = ref(false);
// 分析按钮事件
function handleAnalyzeClick() {
  analyzeBtnClick.value = true;
  etfCodesParams.length = 0;
  weightsParams.length = 0;
  etfList.value.forEach((item) => {
    etfCodesParams.push(item.code);
    weightsParams.push(item.ratio);
  });
  getPortfolioSimulatorCalculate();
  getPortfolioSimulatorReturnVol();
}
// 获取组合模拟成本
function getPortfolioSimulatorCalculate() {
  quickFactLoading.value = true;
  getPortfolioSimulatorCalculateApi({
    etfCodes: etfCodesParams,
    baseDate: dayValue.value,
    weights: weightsParams,
  })
    .then((res) => {
      if (res.code === 200) {
        quickFactLoading.value = false;
        facts.value = [
          {
            label: "加权平均管理费率",
            value: res.data.costResult.weightedAvgManagementFee + "%",
          },
          {
            label: "加权平均托管费率",
            value: res.data.costResult.weightedAvgCustodianFee + "%",
          },
          {
            label: "加权平均总成本",
            value: res.data.costResult.weightedAvgTotalCost + "%",
          },
        ];
      }
    })
    .finally(() => {
      quickFactLoading.value = false;
    });
}

const tableData = ref([]);
const tableColumn = [
  { prop: "dataLabel", label: "数据标签" },
  { prop: "dataType", label: "数据类型" },
  { prop: "oneMonth", label: "近一月" },
  { prop: "threeMonth", label: "近三月" },
  { prop: "sixMonth", label: "近六个月" },
  { prop: "ytd", label: "今年以来" },
  { prop: "oneYear", label: "近一年" },
  { prop: "threeYear", label: "近三年" },
  { prop: "fiveYear", label: "近五年" },
  { prop: "ltd", label: "成立以来" },
];
const tableColumn2 = [
  { prop: "dataLabel", label: "" },
  { prop: "return", label: "收益率" },
  { prop: "volatility", label: "波动率" },
]
const tableData2 = ref([]);
function styleColor(value: any) {
  if (value) {
    return value >= 0 ? "red" : "green";
  } else {
    return "black";
  }
}
const tableLoading = ref(false);
const portfolioRisk = ref<Record<string, any>>({});
// 获取组合模拟波动率
function getPortfolioSimulatorReturnVol() {
  tableLoading.value = true;
  getPortfolioSimulatorReturnVolApi({
    etfCodes: etfCodesParams,
    baseDate: dayValue.value,
    weights: weightsParams,
  }).then((res) => {
    if (res.code === 200) {
      if (res.data.returnVolTable.length > 0) {
        const returnRow = res.data.returnVolTable.find((i: any) => i.dataLabel === '收益率')
        const volRow = res.data.returnVolTable.find((i: any) => i.dataLabel === '波动率')
        const transposed = tableColumn
          .filter((col) => col.prop !== 'dataLabel' && col.prop !== 'dataType')
          .map((col) => ({
            dataLabel: col.label,
            return: returnRow ? returnRow[col.prop] : null,
            volatility: volRow ? volRow[col.prop] : null,
          }))
        tableData.value = transposed as any
      } else {
        tableData.value = [];
      }
      // tableData.value = res.data.returnVolTable;
      portfolioRisk.value = res.data.riskIndicator;
    }
  }).finally(() => {
    tableLoading.value = false;
  });
}

</script>

<style lang="scss" scoped>
.portfolio-simulator {
  width: 100%;
  height: 100%;

  .config-ratio-box {
    padding: 20px;

    .section-title {
      font-weight: 600;
      font-size: var(--font-size-extra-large);
      padding-left: 20px;
    }

    p {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
      padding-left: 20px;
    }

    .ratio-container {
      .etf-ratio-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e5e5;
        gap: 20px;

        &:last-child {
          border-bottom: none;
        }

        .etf-close-btn {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 50%;
          background-color: #fff;
          transition: all 0.3s;

          span {
            font-size: 18px;
            line-height: 1;
            color: #666;
          }

          &:hover {
            background-color: #f5f5f5;
            border-color: #999;
          }
        }

        .etf-info {
          min-width: 300px;
          width: 30%;
          padding-left: 30px;

          .etf-code {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .etf-name {
            font-size: 14px;
            color: #666;
          }
        }

        .etf-details {
          display: flex;
          gap: 40px;
          min-width: 400px;
          width: 35%;
          justify-content: space-evenly;
          .detail-item {
            .label {
              font-size: 16px;
              color: #999;
              margin-bottom: 4px;
            }

            .value {
              font-size: 16px;
              color: #333;
              font-weight: 500;
            }
          }
        }

        .ratio-control {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;

          .slider-wrapper {
            flex: 1;

            :deep(.el-slider) {
              .el-slider__runway {
                height: 6px;
                background-color: #e0e0e0;

                .el-slider__bar {
                  background-color: var(--theme-purple);
                }

                .el-slider__button-wrapper {
                  .el-slider__button {
                    width: 18px;
                    height: 18px;
                    border: 2px solid var(--theme-purple);
                    background-color: #fff;
                  }
                }
              }
            }
          }

          .ratio-input {
            :deep(.el-input-number) {
              width: 80px;

              .el-input__wrapper {
                padding: 4px 11px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;

                .el-input__inner {
                  text-align: center;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }

    .ratio-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding: 0 20px;

      .analyze-btn {
        background-color: var(--theme-purple);
        border-color: var(--theme-purple);
        padding: 10px 32px;
        font-size: 14px;
        font-weight: 500;

        &:hover {
          background-color: var(--theme-purple);
          border-color: var(--theme-purple);
        }
      }
      .is-disabled {
        opacity: 0.6;
      }

      .total-ratio {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        transition: color 0.3s;

        &.ratio-error {
          color: #f56c6c;
        }
      }
    }
  }
  .divider {
    width: 100%;
    height: 4px;
    background: var(--theme-purple);
    margin: 20px 0;
  }
  :deep(.block) {
    flex: 1;
    min-width: 0;
    max-width: 70%;
    .section-title {
      font-weight: 600;
      font-size: var(--font-size-extra-large);
      margin-bottom: 10px;
      color: #222;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .analyst-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .info-list {
      border-radius: 0;
      border: none;
      background: none;
      padding: 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px solid #ececec;
      font-size: var(--font-size-base);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-row span:first-child {
      color: #333;
    }
    .info-row .link {
      color: var(--theme-purple);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
