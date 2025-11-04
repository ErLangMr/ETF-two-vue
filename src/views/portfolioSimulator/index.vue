<template>
  <div class="portfolio-simulator">
    <div class="page-header">
      <h1>ETF组合模拟器</h1>
    </div>
    <div class="config-ratio-box">
      <h3>配置比例</h3>
      <p>配置比例不得低于或高于100%。</p>
      <div class="ratio-container">
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
              <div class="label">ESG 评分</div>
              <div class="value">{{ etf.esgScore }}</div>
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
          >分 析</el-button
        >
        <div class="total-ratio" :class="{ 'ratio-error': totalRatio > 100 }">
          {{ totalRatio }} %
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div style="padding: 20px">
      <QuickFacts :facts="facts" title="成本"></QuickFacts>
      <div style="height: 30px;"></div>
      <Performance />
      <div style="height: 30px;"></div>
      <div>
        <div class="block">
          <div class="section-title">组合风险</div>
          <div class="info-list">
            <div class="info-row">
              <span>过去5日波动率</span
              ><span class="linkStyle">{{ "val" }}</span>
            </div>
            <div class="info-row">
              <span>过去20日波动率</span
              ><span class="linkStyle">{{ "val" }}</span>
            </div>
            <div class="info-row">
              <span>过去50日波动率</span>
              <span>{{ formatValue(29.9999, "percent") }}</span>
            </div>
            <div class="info-row">
              <span>过去200日波动率</span>
              <span>{{ "val" }}</span>
            </div>
            <div class="info-row">
              <span>Beta</span>
              <span>{{ "val" }}</span>
            </div>
            <div class="info-row">
              <span>标准差</span>
              <span>{{ "val" }}</span>
            </div>
            <div class="info-row">
              <span>夏普比率</span>
              <span>{{ "val" }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 30px;"></div>
      <AnalystOpinions />
      <div style="height: 30px;"></div>
      <ComboPositionFeature />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePortfolioSimulatorStore } from "@/store/portfolioSimulator";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { formatValue } from "@/utils/formatValue";
import QuickFacts from "@/components/QuickFacts.vue";
import Performance from "@/views/detailsView/components/Performance.vue";
import AnalystOpinions from "./details/AttributionAnalysis.vue";
import ComboPositionFeature from "./details/comboPositionFeature.vue";
const router = useRouter();

interface ETFItem {
  code: string;
  name: string;
  expenseRatio: string;
  esgScore: string;
  ratio: number;
}

const etfList = ref<ETFItem[]>([
  {
    code: "QQQ",
    name: "Invesco QQQ Trust Series I",
    expenseRatio: "0.20",
    esgScore: "6.27",
    ratio: 37,
  },
  {
    code: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    expenseRatio: "0.09",
    esgScore: "6.27",
    ratio: 63,
  },
]);

const portfolioSimulatorStore = usePortfolioSimulatorStore();
onMounted(() => {
  console.log(portfolioSimulatorStore.selectETFList, "selectETFList");
  // if (portfolioSimulatorStore.selectETFList.length === 0){
  //   ElMessageBox.confirm(
  //   '没有选择需要组合的ETF，是否跳转到筛选器页面？',
  //   '警告',
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
  //   .then(() => {
  //     router.push({
  //       name: "screener",
  //     })
  //   })
  //   .catch(() => {
  //   })
  // } else{
  //   etfList.value = portfolioSimulatorStore.selectETFList;
  // }
});

const totalRatio = computed(() => {
  return etfList.value.reduce((sum, etf) => sum + etf.ratio, 0);
});

const removeETF = (index: number) => {
  if (etfList.value.length <= 2) return;
  etfList.value.splice(index, 1);
};
const facts = ref([
  { label: "加权平均管理费率", value: "0.77%" },
  {
    label: "加权平均托管费率",
    value: "100.00%",
  },
  { label: "加权平均总成本", value: "0.00%" },
]);

</script>

<style lang="scss" scoped>
.portfolio-simulator {
  width: 100%;
  height: 100%;

  .config-ratio-box {
    padding: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
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
          min-width: 200px;
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
          min-width: 500px;
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
      font-size: var(--font-size-base);
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
