<template>
  <div class="position-analysis">
    <div style="display: flex; gap: 30px">
      <div style="width: 60%">
        <h3>权重集中度</h3>
        <div id="weight-concentration"></div>
      </div>
      <div style="width: 40%">
        <h3>市值分布</h3>
        <div id="market-value-distribution"></div>
      </div>
    </div>
    <div>
      <h3>行业分布</h3>
      <div style="display: flex; gap: 30px">
        <div style="width: 60%;height: 400px;" id="industry-proportion"></div>
        <div style="width: 40%">
          <div class="info-list">
            <div class="info-row">
              <span>基日</span><span class="linkStyle"> xx </span>
            </div>
            <div class="info-row">
              <span>基点</span><span class="linkStyle"> xx </span>
            </div>
            <div class="info-row">
              <span>发布日期</span>
              <span>xx</span>
            </div>
            <div class="info-row">
              <span>发布机构</span>
              <span>xx</span>
            </div>
            <div class="info-row">
              <span>加权方式</span>
              <span>ss</span>
            </div>
            <div class="info-row">
              <span>收益处理方式</span>
              <span>ss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h3>地区分布</h3>
      <div style="display: flex; gap: 30px">
        <div style="width: 60%;height: 400px;" id="region-distribution"></div>
        <div style="width: 40%">
          <div class="info-list">
            <div class="info-row">
              <span>基日</span><span class="linkStyle"> xx </span>
            </div>
            <div class="info-row">
              <span>基点</span><span class="linkStyle"> xx </span>
            </div>
            <div class="info-row">
              <span>发布日期</span>
              <span>xx</span>
            </div>
            <div class="info-row">
              <span>发布机构</span>
              <span>xx</span>
            </div>
            <div class="info-row">
              <span>加权方式</span>
              <span>ss</span>
            </div>
            <div class="info-row">
              <span>收益处理方式</span>
              <span>ss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { formatValue } from "@/utils/formatValue";

const props = defineProps({
  tabActiveName: {
    type: String,
    required: true,
  },
});
watch(
  () => props.tabActiveName,
  (newValue) => {
    if (newValue === "PositionAnalysis") {
      disposeCharts();
      nextTick(() => {
        initWeightChart();
        initMarketValueChart();
        initIndustryProportionChart()
        initRegionDistributionChart()
      });
    }
  }
);
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
let weightChart: echarts.ECharts | null = null;
let marketValueChart: echarts.ECharts | null = null;
let industryProportionChart: echarts.ECharts | null = null;
let regionDistributionChart: echarts.ECharts | null = null;
function initWeightChart() {
  weightChart = echarts.init(document.getElementById("weight-concentration"));
  weightChart.setOption({
    //   title: {
    //   text: '业绩表现'
    // },
    tooltip: {
      trigger: "axis",
    },

    legend: {
      orient: "horizontal",
      left: "center",
      bottom: "1%",
    },
    grid: {
      top: "10%",
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [310, 232, 201, 134, 90, 40, 10],
      },
      {
        name: "Union Ads",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [20, 82, 131, 200, 260, 290, 310],
      },
    ],
  });
}
function initMarketValueChart() {
  marketValueChart = echarts.init(
    document.getElementById("market-value-distribution")
  );
  marketValueChart.setOption({
    title: {
      text: "Referer of a Website",
      subtext: "Fake Data",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
}
function initIndustryProportionChart() {
  industryProportionChart = echarts.init(
    document.getElementById("industry-proportion")
  );
  const rawData = [
    [100, 302, 301, 334, 390, 330, 320],
    [320, 132, 101, 134, 90, 230, 210],
    [220, 182, 191, 234, 290, 330, 310],
    [150, 212, 201, 154, 190, 330, 410],
    [820, 832, 901, 934, 1290, 1330, 1320],
  ];
  const totalData: any = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  const series = [
    "Direct",
    "Mail Ad",
    "Affiliate Ad",
    "Video Ad",
    "Search Engine",
  ].map((name, sid) => {
    return {
      name,
      type: "bar",
      stack: "total",
      barWidth: "60%",
      label: {
        show: true,
        formatter: (params: any) => Math.round(params.value * 1000) / 10 + "%",
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      ),
    };
  });
  industryProportionChart.setOption({
    legend: {
      selectedMode: false,
    },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    series,
  });
}
function initRegionDistributionChart() {
  regionDistributionChart = echarts.init(
    document.getElementById("region-distribution")
  );
  const rawData = [
    [100, 302, 301, 334, 390, 330, 320],
    [320, 132, 101, 134, 90, 230, 210],
    [220, 182, 191, 234, 290, 330, 310],
    [150, 212, 201, 154, 190, 330, 410],
    [820, 832, 901, 934, 1290, 1330, 1320],
  ];
  const totalData: any = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  const series = [
    "Direct",
    "Mail Ad",
    "Affiliate Ad",
    "Video Ad",
    "Search Engine",
  ].map((name, sid) => {
    return {
      name,
      type: "bar",
      stack: "total",
      barWidth: "60%",
      label: {
        show: true,
        formatter: (params: any) => Math.round(params.value * 1000) / 10 + "%",
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      ),
    };
  });
  regionDistributionChart.setOption({
    legend: {
      selectedMode: false,
    },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    series,
  });
}

function resizeChart() {
  const charts = [weightChart, marketValueChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [weightChart, marketValueChart];

  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
</script>

<style lang="scss" scoped>
.position-analysis {
  width: 100%;
  height: 100%;
  #weight-concentration,
  #market-value-distribution {
    width: 100%;
    height: 400px;
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
</style>
