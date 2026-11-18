<template>
  <view class="stats">
    <view v-for="item in items" :key="item.label" class="stat">
      <view class="stat__value">
        <text class="stat__num">{{ item.value }}</text>
        <text class="stat__unit">{{ item.unit }}</text>
      </view>
      <text class="stat__label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
// 纯展示组件：数据由父页面算好传进来
defineProps({
  items: { type: Array, default: () => [] }
})
</script>

<style scoped>
.stats {
  display: flex;
  background-color: #ffffff;
  border-radius: 28rpx;
  border: 1rpx solid #ece1d5;
  overflow: hidden;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26rpx 0;
}

.stat__value {
  display: flex;
  align-items: baseline;
}

.stat__num {
  font-size: 40rpx;
  font-weight: 700;
  color: #241c16;
}

.stat__unit {
  margin-left: 4rpx;
  font-size: 20rpx;
  color: #a08f80;
}

.stat__label {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #a08f80;
}
</style>
