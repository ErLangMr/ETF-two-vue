<template>
  <div class="attribution-analysis">
    <div>
      <h3>组合归因分析</h3>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="行业名称" />
        <el-table-column label="行业配置（%）" align="center">
          <el-table-column prop="jijin" label="基金" />
          <el-table-column prop="bijiaojizhun" label="比较基准" width="120" />
          <el-table-column prop="zhengfu" label="+/-" width="120" />
        </el-table-column>
        <el-table-column label="收益率%）" align="center">
          <el-table-column prop="jijin" label="基金" width="120" />
          <el-table-column prop="bijiaojizhun" label="比较基准" width="120" />
          <el-table-column prop="zhengfu" label="+/-" width="120" />
        </el-table-column>
        <el-table-column label="归因分析%）" align="center">
          <el-table-column prop="jijin" label="基金" width="120" />
          <el-table-column prop="bijiaojizhun" label="比较基准" width="120" />
          <el-table-column prop="zhengfu" label="+/-" width="120" />
        </el-table-column>
      </el-table>
    </div>
    <div class="divisorBox">
      <header>
        <span>模型选择：</span>
        <el-select
          v-model="divisorVal"
          placeholder="Select"
          @change="changeDivisor"
          style="width: 240px"
        >
          <el-option
            v-for="item in divisorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </header>
      <div class="divisorChartBox">
        <!-- <div class="oneChartBox">
          <div id="oneFirstChart" style="height: 100%; width: 40%"></div>
          <div
            style="
              height: 100%;
              width: 60%;
              display: flex;
              justify-content: space-between;
            "
          >
            <div id="oneSecondChart" style="height: 100%; width: 50%"></div>
            <div id="oneThirdChart" style="height: 100%; width: 50%"></div>
          </div>
        </div> -->
        <div class="towChartBox">
          <div id="twoFirstChart" style="height: 100%; width: 50%"></div>
          <div id="twoSecondChart" style="height: 100%; width: 50%"></div>
        </div>
        <!-- <div class="threeChartBox">
          <div id="threeFirstChart" style="height: 100%; width: 50%"></div>
          <div id="threeSecondChart" style="height: 100%; width: 50%"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";


onMounted(() => {
  window.addEventListener("resize", resizeChart);
  nextTick(() => {
        disposeCharts()
        getDivisorData();
      });
});
const tableData = [
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
  {
    date: "行业名称",
    jijin: "Tom",
    bijiaojizhun: "California",
  },
];
const chartData = [
  [
    [-28604, -77, 17096869, "中国", "表现不佳行业"],
    [-1516, -68, 1154605773, "印度", "表现不佳行业"],
    [28599, -75, 4986705, "巴西", "表现不佳行业"],
    [31476, -75.4, 78958237, "俄罗斯", "表现不佳行业"],
    [1777, -57.7, 870601776, "尼日利亚", "表现不佳行业"],
    [-2076, 67.9, 20194354, "墨西哥", "表现不佳行业"],
    [-24021, 75.4, 3397534, "越南", "表现不佳行业"],
    [-10088, 70.8, 38195258, "埃及", "表现不佳行业"],
    [-10670, -67.3, 53994605, "伊朗", "表现不佳行业"],
    [-37062, 75.4, 252847810, "法国", "表现不佳行业"],
  ],
  [
    [31163, 77.4, 27662440, "美国", "表现优异行业"],
    [-13670, -74.7, 10582082, "印尼", "表现优异行业"],
    [-29476, 77.1, 56943299, "巴基斯坦", "表现优异行业"],
    [-28666, 78.1, 254830, "孟加拉国", "表现优异行业"],
    [29550, 79.1, 122249285, "日本", "表现优异行业"],
    [12087, -72, 42972254, "菲律宾", "表现优异行业"],
    [43296, -76.8, 4240375, "埃塞俄比亚", "表现优异行业"],
    [19349, -69.6, 147568552, "德国", "表现优异行业"],
    [26424, 75.7, 57110117, "土耳其", "表现优异行业"],
  ],
];

let myChart: echarts.ECharts | null = null;
const divisorVal = ref("选项1");
const divisorOptions = [
  {
    value: "选项1",
    label: "六因子模型",
  },
  {
    value: "选项2",
    label: "五因子模型",
  },
  {
    value: "选项3",
    label: "四因子模型",
  },
  {
    value: "选项4",
    label: "三因子模型",
  },
];
function changeDivisor() {
  getDivisorData();
}
let oneFirstChart: echarts.ECharts | null = null;
let oneSecondChart: echarts.ECharts | null = null;
let oneThirdChart: echarts.ECharts | null = null;
let twoFirstChart: echarts.ECharts | null = null;
let twoSecondChart: echarts.ECharts | null = null;
let threeFirstChart: echarts.ECharts | null = null;
let threeSecondChart: echarts.ECharts | null = null;
function getDivisorData() {
  // oneFirstChart = echarts.init(document.getElementById("oneFirstChart"));
  // oneSecondChart = echarts.init(document.getElementById("oneSecondChart"));
  // oneThirdChart = echarts.init(document.getElementById("oneThirdChart"));
  twoFirstChart = echarts.init(document.getElementById("twoFirstChart"));
  twoSecondChart = echarts.init(document.getElementById("twoSecondChart"));
  // threeFirstChart = echarts.init(document.getElementById("threeFirstChart"));
  // threeSecondChart = echarts.init(document.getElementById("threeSecondChart"));
  // 临时数据
  const arr = [
    // oneFirstChart,
    twoFirstChart,
    twoSecondChart,
    // threeFirstChart,
    // threeSecondChart,
  ];
  for (let i of arr) {
    initDivisorBarChart(i);
  }
  // 初始化热力图
  // initHeatmapChart(oneSecondChart);
  // initRadarChart(oneThirdChart);
}
function initDivisorBarChart(chart: echarts.ECharts) {
  chart.setOption({
    title: {
      text: "资产配置收益",
      left: "3%",
      top: "3%",
    },
    grid: {
      left: "8%",
      right: "9%",
      top: "15%",
    },
    xAxis: {
      type: "category",
      data: [
        "动量因子",
        "投资因子",
        "盈利因子",
        "价值因子",
        "规模因子",
        "市场因子",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
      },
    ],
  });
}

// 初始化因子相关性热力图
function initHeatmapChart(chart: echarts.ECharts) {
  // X轴因子名称
  const xFactors = ["市场因子", "规模因子", "价值因子", "盈利因子", "投资因子"];
  // Y轴因子名称（顺序不同）
  const yFactors = ["动量因子", "投资因子", "盈利因子", "价值因子", "规模因子"];

  // 相关性系数数据 [x轴索引, y轴索引, 相关系数]
  // 根据图片，只填充有数据的部分，其他为null或不填充
  const correlationData = [
    // 动量因子行（y=0）
    [0, 0, 0.65], // 市场因子
    // 价值因子行（y=1）
    [0, 1, 0.62], // 市场因子
    [1, 1, 0.77], // 规模因子
    // 盈利因子行（y=2）
    [0, 2, 0.07], // 市场因子
    [1, 2, 0.09], // 规模因子
    [2, 2, 0.25], // 价值因子
    // 投资因子行（y=3）
    [0, 3, 0.54], // 市场因子
    [1, 3, 0.61], // 规模因子
    [2, 3, 0.54], // 价值因子
    [3, 3, 0.47], // 盈利因子
    // 动量因子行（y=4）
    [0, 4, 0.66], // 市场因子
    [1, 4, 0.71], // 规模因子
    [2, 4, 0.91], // 价值因子
    [3, 4, 0.26], // 盈利因子
    [4, 4, 0.54], // 投资因子
  ];

  chart.setOption({
    title: {
      text: "区因子相关系数",
      left: "left",
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      position: "top",
      formatter: function (params: any) {
        const xName = xFactors[params.data[0]];
        const yName = yFactors[params.data[1]];
        return `${yName} vs ${xName}<br/>相关系数: ${params.data[2]}`;
      },
    },
    grid: {
      left: 70,
      right: 20,
      top: 40,
      bottom: 20,
    },
    xAxis: {
      type: "category",
      data: xFactors,
      splitArea: {
        show: true,
      },
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "category",
      data: yFactors,
      splitArea: {
        show: true,
      },
      axisLabel: {
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: false,
      show: false,
      inRange: {
        color: [
          "#fef5e7",
          "#fcbba1",
          "#fc9272",
          "#fb6a4a",
          "#ef3b2c",
          "#cb181d",
          "#99000d",
        ],
      },
    },
    series: [
      {
        name: "因子相关性",
        type: "heatmap",
        data: correlationData,
        label: {
          show: true,
          fontSize: 13,
          color: "#fff",
          fontWeight: "bold",
          formatter: function (params: any) {
            return params.data[2].toFixed(2);
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#fff",
        },
      },
    ],
  });
}
function initRadarChart(chart: echarts.ECharts) {
  chart.setOption({
    title: {
      text: "Basic Radar Chart",
    },
    legend: {
      // right: "3%",
      bottom: "3%",
      data: ["Allocated Budget", "Actual Spending"],
    },
    radar: {
      // shape: 'circle',
      center: ["50%", "50%"],
      radius: '60%',
      indicator: [
        { name: "Sales", max: 6500 },
        { name: "Administration", max: 16000 },
        { name: "Information Technology", max: 30000 },
        { name: "Customer Support", max: 38000 },
        { name: "Development", max: 52000 },
        { name: "Marketing", max: 25000 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "Allocated Budget",
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "Actual Spending",
          },
        ],
      },
    ],
  });
}
function disposeCharts() {
  const charts = [
    myChart,
    oneFirstChart,
    oneSecondChart,
    oneThirdChart,
    twoFirstChart,
    twoSecondChart,
    threeFirstChart,
    threeSecondChart,
  ];

  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}

function resizeChart() {
  const charts = [
    myChart,
    oneFirstChart,
    oneSecondChart,
    oneThirdChart,
    twoFirstChart,
    twoSecondChart,
    threeFirstChart,
    threeSecondChart,
  ];

  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
// 当组件完全卸载时
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});

const goodTableData = [
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
];
const badTableData = [
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
  { name: "qqw", shizhi: "333", shouyi: "45" },
];
</script>

<style lang="scss" scoped>
.attribution-analysis {
  width: 100%;
  .oneChartBox,
  .towChartBox,
  .threeChartBox {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
