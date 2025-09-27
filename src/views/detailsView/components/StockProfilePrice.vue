<template>
  <div class="stock-profile-price">
    <div class="stock-profile-price-container">
      <!-- 第一行 -->
      <div class="row">
        <div class="block">
          <div class="section-title">重要信息</div>
          <div class="info-list">
            <div class="info-row">
              <span>发行人</span
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.fundMgrs }}</span
              >
            </div>
            <div class="info-row">
              <span>ETF简称</span
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.shortName }}</span
              >
            </div>
            <div class="info-row">
              <span>费用率(%)</span>
              <span>{{ formatValue(props.detailsData?.fundInfoByVitals?.fee, 'percent') }}</span>
            </div>
            <div class="info-row">
              <span>基金成立日</span>
              <span>{{ props.detailsData?.fundInfoByVitals?.setupDate }}</span>
            </div>
            <div class="info-row">
              <span>跟踪指数名称</span>
              <span>{{
                props.detailsData?.fundInfoByVitals?.trackIndexName
              }}</span>
            </div>
            <!-- <div class="info-row">
              <span>Inception</span><span>Apr 09, 2020</span>
            </div>
            <div class="info-row">
              <span>Index Tracked</span><span>Solactive GBS United ...</span>
            </div> -->
          </div>
        </div>
        <!-- <div class="block">
          <div class="section-title analyst-title-row">
            <span>Analyst Report</span>
            <button class="fa-report-btn">FA Report PDF</button>
          </div>
          <div class="analyst-content">
            The BNY Mellon US Large Cap Core Equity ETF (BKLC) tracks an index
            of large cap U.S. equities... and does it for free. That's right:
            BKLC's management fee is zero. BKLC is part of a lineup of ETFs
            introduced by BNY Mellon in April 2020. As a latecomer to a crowded
            market, BNY Mellon is betting that its fee-free and ultra-low-cost
            funds will help win over investors.
            <span class="see-more">See more</span>
          </div>
        </div> -->
        <div class="block">
          <div class="section-title">ETF 数据库主题</div>
          <div class="info-list">
            <div class="info-row">
              <span>资产类型</span
              ><span>
                {{ categoryList.find(item => item.value === props.detailsData?.fundInfoByThemes?.category)?.label }}
              </span>
            </div>
            <div class="info-row">
              <span>风格属性</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.styleAttribute }}
              </span>
            </div>
            <div class="info-row">
              <span>市值属性</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.compMarketCap }}
              </span>
            </div>
            <div class="info-row">
              <span>市值-风格属性</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.investStrategy }}
              </span>
            </div>
            <!-- <div class="info-row">
              <span>Region (General)</span
              ><span class="link" @click="router.push('/etfs-list')">North America</span>
            </div>
            <div class="info-row">
              <span>Region (Specific)</span><span class="link" @click="router.push('/etfs-list')">U.S.</span>
            </div> -->
          </div>
        </div>
      </div>
      <!-- 第二行 -->
      <div class="row">
        <!-- <div class="block">
          <div class="section-title">ETF 数据库主题</div>
          <div class="info-list">
            <div class="info-row">
              <span>资产类型</span
              ><span class="link" @click="router.push('/equities')">
                {{ props.detailsData?.fundInfoByThemes?.category }}
              </span>
            </div>
            <div class="info-row">
              <span>风格属性</span><span class="link" @click="router.push('/etfs-list')">
                  {{ props.detailsData?.fundInfoByThemes?.styleAttribute }}
              </span>
            </div>
            <div class="info-row">
              <span>市值属性</span><span class="link" @click="router.push('/etfs-list')">
                {{ props.detailsData.fundInfoByThemes.compMarketCap }}
              </span>
            </div>
            <div class="info-row">
              <span>市值-风格属性</span><span class="link" @click="router.push('/etfs-list')">
                {{ props.detailsData.fundInfoByThemes.investStrategy }}
              </span>
            </div>
            <div class="info-row">
              <span>Region (General)</span
              ><span class="link" @click="router.push('/etfs-list')">North America</span>
            </div>
            <div class="info-row">
              <span>Region (Specific)</span><span class="link" @click="router.push('/etfs-list')">U.S.</span>
            </div>
          </div>
        </div> -->
        <!-- <div class="block">
          <div class="section-title">FactSet Classifications</div>
          <div class="info-list">
            <div class="info-row">
              <span>Segment</span><span>Equity: U.S. - Large Cap</span>
            </div>
            <div class="info-row">
              <span>Category</span><span>Size and Style</span>
            </div>
            <div class="info-row"><span>Focus</span><span>Large Cap</span></div>
            <div class="info-row">
              <span>Niche</span><span>Broad-based</span>
            </div>
            <div class="info-row">
              <span>Strategy</span><span>Vanilla</span>
            </div>
            <div class="info-row">
              <span>Weighting Scheme</span><span>Market Cap</span>
            </div>
          </div>
        </div> -->
        <div class="block">
          <div class="section-title">交易数据</div>
          <div class="info-list">
            <div class="info-row">
              <span>开盘价</span
              ><span>
                {{ formatValue(props.detailsData?.fundInfoByTrading?.open) }}
              </span>
            </div>
            <div class="info-row">
              <span>成交额(百万元)</span
              ><span>
                {{ formatValue(props.detailsData?.fundInfoByTrading?.amount, 'million') }}
              </span>
            </div>
            <div class="info-row">
              <span>最低价</span
              ><span>
                {{ formatValue(props.detailsData?.fundInfoByTrading?.low) }}
              </span>
            </div>
            <div class="info-row">
              <span>最高价</span
              ><span>
                {{ formatValue(props.detailsData?.fundInfoByTrading?.high) }}
              </span>
            </div>
            <div class="info-row">
              <span>过去 52 周最低价</span
              ><span>
                {{
                  formatValue(
                    props.detailsData?.fundInfoByTrading?.fiftyTwoWeekLow
                  )
                }}
              </span>
            </div>
            <div class="info-row">
              <span>过去 52 周最高价</span
              ><span>
                {{
                  formatValue(
                    props.detailsData?.fundInfoByTrading?.fiftyTwoWeekHigh
                  )
                }}
              </span>
            </div>
            <div class="info-row">
              <span>基金规模(百万元)</span
              ><span>
                {{
                  formatValue(
                    props.detailsData?.fundInfoByTrading?.totalMarketValue,
                    'million'
                  )
                }}
              </span>
            </div>
            <div class="info-row">
              <span>基金份额</span
              ><span>
                {{ formatValue(props.detailsData?.fundInfoByTrading?.unitTotal) }}
              </span>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="section-title">历史交易数据</div>
          <div class="info-list">
            <div class="info-row">
              <span>过去 1 个月日均成交额(百万元)</span>
              <span>
                {{
                  formatValue(
                    props.detailsData?.fundInfoByHistorical
                      ?.avgDailyVolumeForMoth,
                      'million'
                  )
                }}
              </span>
            </div>
            <div class="info-row">
              <span>过去 3 个月日均成交额(百万元)</span
              ><span>
                {{
                  formatValue(
                    props.detailsData?.fundInfoByHistorical?.avgDailyVolume,
                    'million'
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 第三行 -->
      <!-- <div class="row">
        <div class="block">
          <div class="section-title">交易数据</div>
          <div class="info-list">
            <div class="info-row"><span>开盘价</span><span>
              {{ formatValue(props.detailsData.fundInfoByTrading.open) }}
            </span></div>
            <div class="info-row"><span>成交额</span><span>
              {{ formatValue(props.detailsData.fundInfoByTrading.amount) }}
            </span></div>
            <div class="info-row"><span>最低价</span><span>
              {{ formatValue(props.detailsData.fundInfoByTrading.low) }}
              </span>
            </div>
            <div class="info-row"><span>最高价</span><span>
              {{ formatValue(props.detailsData.fundInfoByTrading.high) }}
            </span></div>
            <div class="info-row">
              <span>过去 52 周最低价</span><span>
                {{ formatValue(props.detailsData.fundInfoByTrading.fiftyTwoWeekLow) }}
              </span>
            </div>
            <div class="info-row">
              <span>过去 52 周最高价</span><span>
                {{ formatValue(props.detailsData.fundInfoByTrading.fiftyTwoWeekHigh) }}
              </span>
            </div>
            <div class="info-row"><span>基金规模</span><span>
              {{ formatValue(props.detailsData.fundInfoByTrading.totalMarketValue) }}
            </span></div>
            <div class="info-row"><span>基金份额</span><span>
              {{ props.detailsData.fundInfoByTrading.unitTotal }}
            </span></div>
          </div>
        </div>
        <div class="block">
          <div class="section-title">历史交易数据</div>
          <div class="info-list">
            <div class="info-row">
              <span>过去 1 个月日均成交额</span>
              <span>
                {{ formatValue(props.detailsData.fundInfoByHistorical.avgDailyVolumeForMoth) }}
              </span>
            </div>
            <div class="info-row">
              <span>过去 3 个月日均成交额</span><span>
                {{ formatValue(props.detailsData.fundInfoByHistorical.avgDailyVolume) }}
              </span>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 第四行：ETF Database Large Cap Growth Equities Category -->
      <div class="">
        <div class="block">
          <EtfCompareTable
            title="追踪同一指数的 ETF"
            :columns="columns"
            :data="tableData"
          />
        </div>
        <div class="block"></div>
      </div>
      <!-- 第五行：FactSet Equity: U.S. - Large Cap Segment -->
      <!-- <div class="">
        <div class="block">
          <EtfCompareTable
            title="Alternative ETFs in the FactSet Equity: U.S. - Large Cap Segment"
            :columns="columns"
            :data="table2"
          />
        </div>
        <div class="block"></div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import EtfCompareTable from "@/components/EtfCompareTable.vue";
import { useRouter } from "vue-router";
import { formatValue } from "@/utils/formatValue";
import { ref, watch } from "vue";

const router = useRouter();
const props = defineProps({
  detailsData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
])

function clickVitals(data: any) {
  router.push({
    path: '/proshares',
    query: {
      issuer: JSON.stringify(data),
    },
  })
}

watch(
  () => props.detailsData,
  (newVal) => {
    if (newVal) {
      if (newVal.fundInfoByIndexData) {
        tableData.value = []
        Object.keys(newVal.fundInfoByIndexData).forEach((key) => {
          let typeName = ''
          if(key === "bestReturn") {
            typeName = '年初至今回报最高'
          } else if(key === "highestVolume") {
            typeName = '流动性最高'
          } else if(key === "largestSize") {
            typeName = '规模最大'
          }else if(key === "lowestFee") {
            typeName = '费用最低'
          }
          tableData.value.push({
            type: typeName,
            shortName: newVal.fundInfoByIndexData[key].shortName,
            fee: newVal.fundInfoByIndexData[key].fee,
            totalMarketValue: newVal.fundInfoByIndexData[key].totalMarketValue,
            avgDailyVolumeForYear:
              newVal.fundInfoByIndexData[key].avgDailyVolumeForYear,
            ytdReturns: newVal.fundInfoByIndexData[key].ytdReturns,
          });
        });
      }
    }
  }
);

const columns = [
  { key: "type", label: "类型" },
  {
    key: "shortName",
    label: "简称",
    // isLink: true,
    // onClick: (symbol: string) => {
    //   router.push(`/details?symbol=${symbol}`);
    // },
  },
  { key: "fee", label: "费用率(%)" },
  { key: "totalMarketValue", label: "基金规模(百万元)",unit: 'million' },
  { key: "avgDailyVolumeForYear", label: "日均成交额(百万元)",unit: 'million' },
  { key: "ytdReturns", label: "年初至今回报(%)" },
];

const tableData = ref<Record<string, any>[]>([]);
</script>

<style scoped lang="scss">
.stock-profile-price {
  background: #fff;
  color: #222;
  font-size: var(--font-size-base);
}
.stock-profile-price-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.row {
  display: flex;
  gap: 62px;
}
.block {
  flex: 1;
  min-width: 0;
}
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

.fa-report-btn {
  background: var(--theme-purple);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-weight: 600;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 10px;
}
.fa-report-btn:hover {
  background: var(--theme-purple);
}
.analyst-content {
  color: #444;
  font-size: var(--font-size-base);
  line-height: 1.7;
  margin-bottom: 4px;
}
.see-more {
  color: var(--theme-purple);
  cursor: pointer;
  margin-left: 6px;
  font-size: var(--font-size-base);
}
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 0;
  }
  .block {
    margin-bottom: 40px;
  }
}
</style>
