<template>
  <div class="custom-charts">
    <div ref="chartRef" style="width: 100%; height: 100px"></div>
    <div class="legend-container">
      <div class="legend-row">
        <div
          v-for="(item, idx) in sectorData"
          :key="item.name"
          class="legend-item"
          :class="{ inactive: !legendSelected[idx] }"
          @click="toggleLegend(idx)"
        >
          <span class="legend-name">{{ item.name }}</span>
          <span
            class="legend-color"
            :style="{ background: colors[idx] }"
          ></span>
          <span class="legend-value">{{ item.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import * as echarts from "echarts";
import type {
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
  EChartsOption,
} from "echarts";

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let resizeHandler: (() => void) | null = null;

const props = defineProps<{
  sectorData: { name: string; value: number }[];
  active?: boolean;
  title?: string;
}>();

const colors = [
  "#2186c6", // Electronic Technology
  "#00d6c7", // Technology Services
  "#1cc6f3", // Finance
  "#1bb1d6", // Retail Trade
  "#5a6b5c", // Health Technology
  "#3a9e7a", // Consumer Non-Durables
  "#1bb1b6", // Producer Manufacturing
  "#1bb1d6", // Consumer Services
  "#a6e28a", // Utilities
  "#3a5a4c", // Energy Minerals
  "#c6e25a", // Consumer Durables
  "#1bb1b6", // Transportation
  "#3a6b9e", // Process Industries
  "#2186c6", // Commercial Services
  "#5a6b5c", // Communications
  "#a6e28a", // Industrial Services
  "#e25a6b", // Distribution Services
  "#1bb1d6", // Non-Energy Minerals
  "#1cc6f3", // CASH
  "#3a9e7a", // Health Services
  "#a6e28a", // Miscellaneous
];

const legendSelected = ref(Array(props.sectorData.length).fill(true));

function updateChart() {
  if (!chartInstance) return;
  // 计算可见项总和
  const visibleData = props.sectorData
    .map((item, idx) => ({ ...item, idx }))
    .filter((item, idx) => legendSelected.value[idx]);
  const total = visibleData.reduce((sum, item) => sum + item.value, 0);

  // 重新分配百分比和起止
  let start = 0;
  const percentMap: Record<number, { start: number; end: number }> = {};
  visibleData.forEach((item) => {
    const percent = (item.value / total) * 100;
    percentMap[item.idx] = { start, end: start + percent };
    start += percent;
  });

  // 保证series顺序和sectorData一致
  const series = props.sectorData.map((item, idx) => {
    if (!legendSelected.value[idx]) {
      return {
        id: idx,
        name: `${item.name}： ${item.value}%`,
        type: "custom",
        data: [],
        itemStyle: { color: colors[idx] },
      };
    }
    const { start, end } = percentMap[idx];
    return {
      id: idx,
      name: `${item.name}： ${item.value}%`,
      type: "custom",
      universalTransition: true,
      animationDurationUpdate: 500,
      animationEasingUpdate: "cubicOut",
      renderItem: (
        params: CustomSeriesRenderItemParams,
        api: CustomSeriesRenderItemAPI
      ) => {
        const y = api.getHeight() - 100;
        const height = 100;
        const startX = api.coord([start, 0])[0];
        const endX = api.coord([end, 0])[0];
        return {
          type: "rect",
          shape: {
            x: startX,
            y: y,
            width: endX - startX,
            height: height,
          },
          style: {
            fill: colors[idx],
          },
        };
      },
      data: [[start, end]],
      itemStyle: { color: colors[idx] },
    };
  });

  chartInstance.setOption(
    {
      series,
      animation: true,
      animationDuration: 500,
      animationEasing: "cubicOut",
    },
    false
  );
}

function toggleLegend(idx: number) {
  legendSelected.value[idx] = !legendSelected.value[idx];
  updateChart();
}

const initChart = async () => {
  if (!chartRef.value) return;

  // 如果已经存在实例，先销毁
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  await nextTick();

  // 确保元素可见
  if (chartRef.value.offsetWidth === 0 || chartRef.value.offsetHeight === 0) {
    return;
  }

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption({
    title: {
      text: props.title,
      left: 0,
      top: "bottom",
      textAlign: "left",
      textVerticalAlign: "middle",
      textStyle: {
        fontSize: 18,
        color: "#333",
        fontWeight: "normal",
        lineHeight: 28,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.seriesName}`,
    },
    grid: { left: 120, right: 0, top: 0, bottom: 0 },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 1 },
    legend: {
      show: false,
      type: "plain",
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemWidth: 18,
      itemHeight: 18,
      itemGap: 30,
      textStyle: {
        fontSize: 16,
        color: "#222",
        padding: [0, 4, 0, 0],
      },
      icon: "rect",
      formatter: (name: string) => name,
    },
    series: [],
  } as EChartsOption);
  updateChart();
};

watch(
  () => props.active,
  (newVal) => {
    if (newVal) {
      initChart();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // 响应式resize
  resizeHandler = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };
  window.addEventListener("resize", resizeHandler);
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>

<style scoped lang="scss">
.custom-charts {
  width: 100%;
  height: 100%;
  .legend-container {
    width: 100%;
    margin-top: 14px;
    display: flex;
    justify-content: flex-start;
    padding-left: 16px;
    padding-right: 16px;
  }

  .legend-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px 16px;
    justify-content: flex-start;
    width: 100%;
  }

  .legend-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 2px;
    margin: 0;
    border: none;
    border-radius: 0;
    background: none;
    font-size: 13px;
    color: #222;
    transition: opacity 0.2s;
    // width: 200px;
    font-size: 12px;
    line-height: 1.5;
    &:hover {
      background: #f5f5f5;
    }
    &.inactive {
      opacity: 0.4;
    }
  }

  .legend-color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
  }

  .legend-name {
    margin-right: 5px;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    width: 120px;
  }

  .legend-value {
    color: #0086c6;
    font-weight: 500;
    white-space: nowrap;
    width: 50px;
  }

  @media (max-width: 768px) {
    .legend-container {
      padding-left: 4px;
      padding-right: 4px;
      margin-top: 6px;
    }
    .legend-row {
      gap: 4px 8px;
    }
    .legend-item {
      min-width: 70px;
      font-size: 11px;
      padding: 0 1px;
    }
    .legend-color {
      width: 9px;
      height: 9px;
      margin-right: 3px;
    }
  }
}
</style>
