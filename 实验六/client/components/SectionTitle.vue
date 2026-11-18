<template>
  <view class="section-title">
    <view class="section-title__text">
      <text class="section-title__title">{{ title }}</text>
      <text v-if="subtitle" class="section-title__sub">{{ subtitle }}</text>
    </view>

    <!-- 具名插槽：右侧可以塞「查看全部」之类的入口 -->
    <slot name="extra" />
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title__text {
  display: flex;
  flex-direction: column;
}

.section-title__title {
  font-size: 36rpx;
  font-weight: 700;
  color: #241c16;
}

.section-title__sub {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #a08f80;
}
</style>
