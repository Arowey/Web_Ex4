<template>
  <view class="empty">
    <text class="empty__emoji">{{ emoji }}</text>
    <text class="empty__title">{{ title }}</text>
    <text v-if="desc" class="empty__desc">{{ desc }}</text>

    <view class="empty__action">
      <slot />
    </view>
  </view>
</template>

<script setup>
defineProps({
  emoji: { type: String, default: '🍽️' },
  title: { type: String, default: '这里什么都没有' },
  desc: { type: String, default: '' }
})
</script>

<style scoped>
.empty {
  padding: 80rpx 40rpx;
  background-color: #ffffff;
  border: 1rpx dashed #ece1d5;
  border-radius: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty__emoji {
  font-size: 64rpx;
  line-height: 1;
  opacity: 0.6;
}

.empty__title {
  margin-top: 18rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #241c16;
}

.empty__desc {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #a08f80;
  text-align: center;
}

.empty__action {
  margin-top: 24rpx;
}
</style>
