<template>
  <div class="tool-etf-list-container">
    <h1>{{ index.trackIndexName }} 相关ETF</h1>
    <div class="list-container">
      <h2>ETF 概览</h2>
      <div class="list-box">
        <ScreenerTable
          class="table-area"
          :table-data="etfList"
          :hasTableFilter="true">
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
import { getFilterTableApi } from "@/api/filterTable";
import { useDevice } from "@/utils/device";

const route = useRoute();
const index = JSON.parse(route.query.index as string || '{}');
console.log(index, 111);

const { isMobile } = useDevice();

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  getFilterTableData();
};
const getFilterTableData = async () => {
  const obj = {
    page: page.value,
    pageSize: pageSize.value,
    codes: index.codes,
  }
  const res: any = await getFilterTableApi(obj);
  etfList.value = res.content
  total.value = res.totalElements
};

const etfList = ref<any[]>([])

onMounted(() => {
  getFilterTableData();
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