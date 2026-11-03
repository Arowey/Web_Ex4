<template>
  <!-- 横向滚动：分类多了也不用换行，小程序和 H5 都支持 -->
  <scroll-view class="tabs" scroll-x :show-scrollbar="false">
    <view
      v-for="item in categories"
      :key="item"
      class="tab"
      :class="{ 'tab--active': item === modelValue }"
      @tap="select(item)"
    >
      <text class="tab__text">{{ item }}</text>
    </view>
  </scroll-view>
</template>

<script setup>
// 同样用自定义 v-model，父页面只写 <CategoryTabs v-model="category" />
defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: String, default: '全部' }
})

const emit = defineEmits(['update:modelValue'])

function select(item) {
  emit('update:modelValue', item)
}
</script>

<style scoped>
.tabs {
  width: 100%;
  white-space: nowrap;
}

.tab {
  display: inline-block;
  padding: 12rpx 26rpx;
  margin-right: 12rpx;
  border-radius: 999rpx;
  border: 1rpx solid #ece1d5;
  background-color: #ffffff;
}

.tab__text {
  font-size: 24rpx;
  color: #6b5b4e;
}

.tab--active {
  background-color: #241c16;
  border-color: #241c16;
}

.tab--active .tab__text {
  color: #ffffff;
}
</style>
