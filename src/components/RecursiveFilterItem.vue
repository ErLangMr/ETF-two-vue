<template>
  <div class="recursive-filter-item">
    <!-- Level 0: 单选折叠面板 - 手风琴模式 -->
    <van-collapse v-if="level === 0" v-model="childActiveName" accordion>
      <van-collapse-item
        v-for="item in items"
        :key="item.value"
        :name="item.value"
        :is-link="false"
      >
        <template #title>
          <van-radio-group :model-value="selectedChild">
            <van-radio
              :name="item.value"
              @click.prevent="$emit('radioChange', item)"
            >
              {{ item.label }}
            </van-radio>
          </van-radio-group>
        </template>

        <recursive-filter-item
          v-if="item.children && item.children.length > 0"
          :items="item.children"
          :level="level + 1"
          :parent-value="item.value"
          :selected-child="selectedChild"
          :selected-codes="selectedCodes"
          @radio-change="(value) => $emit('radioChange', value)"
          @checkbox-change="(item, checked) => $emit('checkboxChange', item, checked)"
        />
      </van-collapse-item>
    </van-collapse>

    <!-- Level >= 1: 多选列表 -->
    <div v-else class="children-list" :class="{ 'is-level-one': level === 1 }">
      <!-- 有子项的节点：使用折叠面板 -->
      <van-collapse v-model="collapseActiveNames" accordion>
        <!-- 标题节点（有子项） -->
        <van-collapse-item
          v-for="item in items.filter(i => i.count === null && i.codes === null && i.children && i.children.length > 0)"
          :key="item.value"
          :name="item.value"
          :is-link="true"
          class="group-collapse-item"
        >
          <template #title>
            <div class="group-title">{{ item.label }}</div>
          </template>
          <recursive-filter-item
            :items="item.children"
            :level="level + 1"
            :parent-value="item.value"
            :selected-child="selectedChild"
            :selected-codes="selectedCodes"
            @checkbox-change="(item, checked) => $emit('checkboxChange', item, checked)"
            class="nested-children"
          />
        </van-collapse-item>

        <!-- 可选节点（有子项） -->
        <van-collapse-item
          v-for="item in items.filter(i => (i.count !== null || i.codes !== null) && i.children && i.children.length > 0)"
          :key="item.value"
          :name="item.value"
          :is-link="true"
          class="item-collapse-item"
        >
          <template #title>
            <div class="item-header">
              <el-checkbox
                :model-value="isChecked(item)"
                @change="(val: boolean | string | number) => $emit('checkboxChange', item, !!val)"
                @click.stop
              >
                {{ item.label }}
              </el-checkbox>
              <span
                v-if="item.count !== null && item.count !== undefined"
                class="alt-count"
                :class="{ 'alt-count-zero': item.count === '0' || item.count === 0 }"
              >
                {{ item.count }}
              </span>
            </div>
          </template>
          <recursive-filter-item
            :items="item.children"
            :level="level + 1"
            :parent-value="item.value"
            :selected-child="selectedChild"
            :selected-codes="selectedCodes"
            @checkbox-change="(item, checked) => $emit('checkboxChange', item, checked)"
            class="nested-children"
          />
        </van-collapse-item>
      </van-collapse>

      <!-- 没有子项的节点：直接显示 -->
      <!-- 标题节点（无子项） -->
      <div
        v-for="item in items.filter(i => i.count === null && i.codes === null && (!i.children || i.children.length === 0))"
        :key="item.value"
        class="group-title"
      >
        {{ item.label }}
      </div>

      <!-- 可选节点（无子项） -->
      <div
        v-for="item in items.filter(i => (i.count !== null || i.codes !== null) && (!i.children || i.children.length === 0))"
        :key="item.value"
        class="item-header"
      >
        <el-checkbox
          :model-value="isChecked(item)"
          @change="(val: boolean | string | number) => $emit('checkboxChange', item, !!val)"
        >
          {{ item.label }}
        </el-checkbox>
        <span
          v-if="item.count !== null && item.count !== undefined"
          class="alt-count"
          :class="{ 'alt-count-zero': item.count === '0' || item.count === 0 }"
        >
          {{ item.count }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  items: any[];
  level: number;
  parentValue?: string;
  selectedChild?: string;
  selectedCodes: string[];
}>();

const emit = defineEmits(['radioChange', 'checkboxChange']);

// 手风琴模式下 v-model 绑定字符串类型
const childActiveName = ref<string>('');

// Level >= 1 的折叠面板状态，手风琴模式使用字符串类型
const collapseActiveNames = ref<string>('');

const isChecked = (item: any) => {
  if (!item.codes || item.codes.length === 0) return false;
  return item.codes.every((code: string) => props.selectedCodes.includes(code));
};
</script>

<style lang="scss" scoped>
.recursive-filter-item {
  .children-list {
    // 标题样式
    .group-title {
      font-size: var(--font-size-base);
      font-weight: 500;
      color: #666;
      padding: 3px 0 2px 0;
      margin-top: 4px;

      &:first-child {
        margin-top: 0;
      }
    }

    // 可选项样式
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
    }

    // 折叠面板样式
    .group-collapse-item,
    .item-collapse-item {
      :deep(.van-collapse-item__title) {
        padding: 5px 0;
        user-select: none;
      }

      :deep(.van-cell__title){
        padding-left: 10px;
      }

      :deep(.van-cell) {
        padding: 0;
        background: transparent;
      }

      :deep(.van-icon) {
        margin-left: auto;
        color: #999;
      }
    }

    // 嵌套子项样式 - 最小间距
    .nested-children {
      margin-left: 8px;
      margin-top: 0;
      border-left: 1px solid #e8e8e8;
      padding-left: 6px;
    }
  }
}

.alt-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  font-size: var(--font-size-base);
  font-weight: 600;
  background-color: #80b600;
  color: #fff;
  margin-left: 8px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.alt-count-zero {
  background-color: #d9534f;
  color: #fff;
}
</style>














