<script setup lang="ts">
import { ElIcon } from "element-plus";
import {
  Setting,
  Edit,
  Location,
  OfficeBuilding,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { nextTick, onMounted, ref } from "vue";
import * as echarts from "echarts";
import { getLeftChartDataApi, getRightChartDataApi, getTop3PopularIndicesApi } from "@/api/home";
import { useDevice } from "@/utils/device";
import { formatValue } from "@/utils/formatValue";
import screenerImg from "@/assets/homeImg/screener.png";
import categoryRanks from "@/assets/homeImg/categoryRanks.png";
import comparisonTool from "@/assets/homeImg/comparisonTool.png";
import stockLocator from "@/assets/homeImg/stockLocator.png";
import portfolioSimulator from "@/assets/homeImg/portfolioSimulator.png";
import intlAssetAllocation from "@/assets/homeImg/intlAssetAllocation.png";



const { isMobile } = useDevice();

const etfToolArr = [
  {
    title: "ETF 筛选器",
    desc: "根据资产类别、发行人、市值、费用率等筛选 ETF。",
    icon: Setting,
    img: screenerImg,
    path: "/screener",
  },
  {
    title: "ETF 分类排行",
    desc: '将ETF根据资产类型、投资区域、发行人等进行分类，并根据资产规模、收益、费率等进行排序。',
    icon: Edit,
    img: categoryRanks,
    path: "/etfs",
  },
  {
    title: "ETF 比较工具",
    desc: "根据资产类别、发行人、市值、费用率等筛选 ETF。",
    icon: Setting,
    img: comparisonTool,
    path: "/comparisonTool",
  },
  {
    title: "ETF 股票定位器",
    desc: '将ETF根据资产类型、投资区域、发行人等进行分类，并根据资产规模、收益、费率等进行排序。',
    icon: Edit,
    img: stockLocator,
    path: "/stockLocator",
  },
  {
    title: "ETF 组合模拟器",
    desc: "快速轻松地查找由50多家不同发行人发行的ETF。",
    icon: OfficeBuilding,
    img: portfolioSimulator,
    path: "/portfolioSimulator",
  },
  {
    title: "ETF 国际资产配置",
    desc: "快速轻松地查找由50多家不同发行人发行的ETF。",
    icon: OfficeBuilding,
    img: intlAssetAllocation,
    path: "/portfolioSimulator",
  },
]
const etfChannel = [
  {
    title: "ETF 跟踪指数",
    desc: "想要拥有特定指数的投资组合吗?关注ETF追踪指数。",
    icon: Location,
    path: "/trackingIndex",
  },
  {
    title: "ETF 热门产品",
    desc: "想要拥有特定指数的投资组合吗?关注ETF追踪指数。",
    icon: Setting,
    path: "/portfolioSimulator",
  },
  {
    title: "ETF 发行人",
    desc: "快速轻松地查找由50多家不同发行人发行的ETF。",
    icon: OfficeBuilding,
    path: "/issuers",
  },
  {
    title: "ETF 特色榜单",
    desc: "想要拥有特定指数的投资组合吗?关注ETF追踪指数。",
    icon: Edit,
    path: "/tool",
  },
];
const router = useRouter();
const handleClick = (path: string) => {
  router.push({
    path: path,
  });
};

onMounted(() => {
  getLeftChartData();
  getRightChartData();
  getTop3PopularIndices();
});



function getLeftChartData() {
  getLeftChartDataApi().then((res) => {
    initLeftChart(res);
  });
}

interface ChartData {
  x: string[];
  y: number[];
}

function getRightChartData() {
  getRightChartDataApi().then((res) => {
    const data = res as ChartData;
    if (!data.y || data.y.length === 0) {
      initRightChart(data, 0, 0);
      return;
    }
    data.y = data.y.map((item) => {
      return formatValue(item);
    });
    const max = Math.max(...data.y);
    const min = Math.min(...data.y);

    // 可以添加一些边距，让图表显示更美观
    const padding = (max - min) * 0.1;
    initRightChart(data, min - padding, max + padding);
  });
}

function getTop3PopularIndices() {
  getTop3PopularIndicesApi().then((res) => {
    indexList.value = res as any;
  });
}

const handleIndexClick = (item: any) => {
  router.push({
    path: "/tool-etf-list",
    query: { index: JSON.stringify(item) },
  });
};
function handleFeaturedListClick(item: any){
  console.log(item, '111')
  router.push({
    path: "/tool-etf-list",
    query: { featured: JSON.stringify(item) },
  });
}

const initLeftChart = (data: any) => {
  const leftChart = echarts.init(
    document.getElementById("leftChart") as HTMLElement
  );
  leftChart.setOption({
    legend: {
      data: ["资产净值(亿元)"],
    },
    title: {
      text: "ETF 市场规模",
      bottom: "0",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: isMobile() ? "10%" : "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.x,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "资产净值(亿元)",
        data: data.y,
        type: "bar",
      },
    ],
    graphic: data.y.length === 0 ? [{
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据',
        fontSize: 16,
        fill: '#999'
      }
    }] : []
  });
};
const initRightChart = (data: any, min: number, max: number) => {
  const rightChart = echarts.init(
    document.getElementById("rightChart") as HTMLElement
  );
  rightChart.setOption({
    legend: {
      data: ["资产净值(亿元)"],
    },
    title: {
      text: "挂钩沪深300指数的ETF产品规模",
      bottom: "0",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: isMobile() ? "10%" : "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.x,
    },
    yAxis: {
      type: "value",
      min: min,
      max: max,
    },
    series: [
      {
        name: "资产净值(亿元)",
        data: data.y,
        type: "line",
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(0, 221, 255)",
            },
            {
              offset: 1,
              color: "rgb(77, 119, 255)",
            },
          ]),
        },
      },
    ],
    graphic: data.y.length === 0 ? [{
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据',
        fontSize: 16,
        fill: '#999'
      }
    }] : []
  });
};
function goToSJS() {
  window.open("https://www.sse.com.cn/assortment/fund/etf/home/");
}
function goToSZ() {
  window.open("https://fund.szse.cn/");
}

const indexList = ref<any[]>([]);

const featuredCategories = [
  {
    title: '效率和成本',
    items: ['日均交易量', '日均交易额', '换手率', '溢价率', '折价率', '跟踪偏离度', '跟踪误差', '总费率']
  },
  {
    title: '分红和估值',
    items: ['单位年度分红', '年度股息率', '份额盈利', '份额净资产', '份额销售收入', '份额现金流', '份额分红', 'ETF P/E', 'ETF P/B', 'ETF P/S', 'ETF P/CF', 'ETF D/P']
  },
  {
    title: '业绩和风险',
    items: ['近1周回报', '近1月回报', '近3月回报', '今年以来回报', '近1年回报', '近3年回报', '近5年回报', '相对市场的超额收益', 'CAPM Alpha', 'CAPM Beta', '过去1个月波动率', '过去3个月波动率', '过去1年波动率', '夏普比率']
  },
  {
    title: '资金流动',
    items: ['近1个月资金净流动', '近3个月资金净流动', '近6个月资金净流动', '近1年资金净流动', '近3年资金净流动', '近5年资金净流动']
  },
  {
    title: '持仓特征',
    items: [
      '持仓股票平均市值',
      '持仓股票平均A股流通市值',
      '持股集中度',
      '行业集中度',
      '大/中/小盘股占比',
      '成长股/价值股占比',
      '高/中/低盈利股占比',
      '高/中/低投资股占比',
      '高/中/低波动股占比',
      '高/中/低动量股占比',
      '高/中/低分红股占比',
      '高/中/低现金流股占比',
      '加权平均P/E',
      '加权平均P/B',
      '加权平均P/S',
      '加权平均P/CF'
    ]
  }
];
</script>

<template>
  <div class="home-chart">
    <div class="home-chart-left">
      <div id="leftChart"></div>
      <img src="@/assets/上证基金网.jpg" alt="chart-left" @click="goToSJS" />
    </div>
    <div class="home-chart-right">
      <div id="rightChart"></div>
      <img src="@/assets/深证基金网.jpg" alt="chart-left" @click="goToSZ" />
    </div>
  </div>
  <div class="divider"></div>
  <h3>ETF工具</h3>
  <div class="card-grid">
    <div class="grid">
      <div v-for="(card, idx) in etfToolArr" :key="idx" class="card">
        <div class="icon-bg">
          <!-- <el-icon :size="24" color="#3b3b6d">
            <component :is="card.icon" />
          </el-icon> -->
          <img :src="card.img" alt="">
        </div>
        <div class="content">
          <div class="title" @click="handleClick(card.path)">
            {{ card.title }}
          </div>
          <div class="desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <h3>ETF频道</h3>
    <div class="card-grid">
    <div class="grid">
      <div v-for="(card, idx) in etfChannel" :key="idx" class="card">
        <div class="icon-bg">
          <el-icon :size="24" color="#3b3b6d">
            <component :is="card.icon" />
          </el-icon>
        </div>
        <div class="content">
          <div class="title" @click="handleClick(card.path)">
            {{ card.title }}
          </div>
          <div class="desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <h3>热门ETFs（中证指数分类）</h3>
  <div class="index-list">
    <div class="index-list-content">
      <div class="index-list-item" v-for="item in indexList" :key="item.category">
        <div class="index-list-item-title">{{ item.category }}</div>
        <div class="index-list-item-content">
          <div class="index-list-item-content-item" v-for="child in item.data" :key="child.title" @click="handleIndexClick(child)">
            <div class="index-list-item-content-item-title">{{ child.trackIndexName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <h3>ETF特色榜单</h3>
  <div class="featured-list">
    <div class="featured-category" v-for="category in featuredCategories" :key="category.title">
      <div class="category-header">{{ category.title }}</div>
      <div class="category-items">
        <div class="category-item" v-for="item in category.items" :key="item" @click="handleFeaturedListClick">
          <span class="arrow">➤</span>
          <span class="item-text">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "@/styles/mixins.scss" as *;
.home-chart {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 470px;
  @include mobile {
    flex-direction: column;
    height: 750px;
  }
  img {
    height: 60px;
    width: 85%;
    cursor: pointer;
    @include mobile {
      height: 40px;
    }
  }
  .home-chart-left {
    width: 50%;
    height: 100%;
    text-align: center;
    @include mobile {
      width: 100%;
    }
    #leftChart {
      width: 100%;
      height: calc(100% - 70px);
    }
  }
  .home-chart-right {
    width: 50%;
    height: 100%;
    text-align: center;
    @include mobile {
      width: 100%;
    }
    #rightChart {
      width: 100%;
      height: calc(100% - 70px);
    }
  }
}
h3{
  color: var(--theme-purple);;
}
.divider {
  width: 100%;
  height: 4px;
  background: var(--theme-purple);
  margin: 20px 0;
}

.card-grid {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 24px;
  background: #ffffff;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  // max-width: 1200px;
  column-gap: 100px;
}
.card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 3px 6px 3px 8px rgba(0, 0, 0, 0.05);
}
.icon-bg {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  background: #f3f3fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  img{
    width: 100%;
    height: 100%;
  }
}
.content {
  flex: 1;
}
.title {
  font-weight: 600;
  color: $theme-purple;
  font-size: var(--font-size-medium);
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
}
.title:hover {
  color: #1da4a8;
}
.title::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #3b3b6d;
}
.desc {
  color: #5c5c7b;
  font-size: var(--font-size-base);
  line-height: 1.6;
}
.index-list{
  padding: 20px;
}
.index-list-item {
  margin-bottom: 30px;
  .index-list-item-title {
    font-size: var(--font-size-medium);
    font-weight: bold;
    margin-bottom: 10px;
  }
  .index-list-item-content {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    .index-list-item-content-item {
      margin-right: 20px;
      // height: 60px;
      width: 300px;
      padding: 10px 20px;
      // line-height: 60px;
      border-radius: 4px;
      background: #f6f6f6;
      // padding: 0 10px;
      font-size: var(--font-size-base);
      font-weight: bold;
      border: 1px solid #eeeeee;
      color: var(--theme-purple);
      cursor: pointer;
      &:hover {
        color: #1da4a8;
      }
    }
  }
}
.featured-list {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
}
.featured-category {
  flex: 1;
  min-width: 200px;
}
.category-header {
  background: var(--theme-purple);
  color: white;
  padding: 12px 20px;
  font-size: var(--font-size-medium);
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 15px;
}
.category-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}
.category-item {
  display: flex;
  align-items: flex-start;
  padding: 4px 10px;
  font-size: var(--font-size-base);
  color: #333;
  line-height: 1.6;
}
.arrow {
  color: #333;
  margin-right: 8px;
  flex-shrink: 0;
}
.item-text {
  flex: 1;
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .card {
    padding: 16px;
  }
  .card-grid {
    padding: 16px;
  }
  .icon-bg {
    width: 36px;
    height: 36px;
  }
  .title {
    font-size: var(--font-size-base);
  }
  .desc {
    font-size: var(--font-size-base);
  }
  .index-list-item-content {
    flex-wrap: wrap;
  }
  .index-list-item-content-item {
    width: 200px;
    margin-bottom: 10px;
  }
  .featured-list {
    flex-direction: column;
    padding: 16px;
  }
}
</style>
