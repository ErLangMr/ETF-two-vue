<template>
  <div class="position-feature">
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      style="width: 100%"
    >
      <el-table-column prop="shortName" label="股票名称" />
      <el-table-column prop="code" label="股票代码" />
      <el-table-column prop="fee" label="市值" />
      <el-table-column prop="ytdReturns" label="权重  (%)" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

const tableData = ref([]);
</script>

<style lang="scss" scoped>
.position-feature {
  width: 100%;
  height: 100%;
}
</style>
