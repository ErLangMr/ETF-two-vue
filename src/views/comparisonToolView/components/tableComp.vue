<template>
  <div class="tableComp_container">
    <el-table
      :data="tableData.data"
      :header-cell-style="{
        background: '#f5f5fa',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '1rem',
      }"
    >
      <el-table-column
        v-for="col in tableData.columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      >
        <template #default="scope">
          <span v-if="col.type !== 'link'">{{
            formatValue(scope.row[col.prop], col?.unit)
          }}</span>
          <span
            class="link-cell"
            v-if="col.type === 'link'"
            @click="columnClick(scope.row, col.prop)"
            >{{ formatValue(scope.row[col.prop], col?.unit) }}</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import { useRouter } from "vue-router";

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({}),
  },
});
const router = useRouter();

const columnClick = (row: any, prop: string) => {
  console.log(row, prop);
  // router.push(
  //   {
  //     path: '/proshares',
  //     query: {
  //       issuer: JSON.stringify(row),
  //     }
  //   }
  // )
};
</script>

<style lang="scss" scoped></style>
