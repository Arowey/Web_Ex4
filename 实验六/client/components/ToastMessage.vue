<template>
  <!-- 小程序里没有 <transition>，用 CSS 动画做入场效果 -->
  <view v-if="visible" class="toast">
    <text class="toast__text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  text: { type: String, default: '' }
})
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 200rpx;
  transform: translateX(-50%);
  padding: 20rpx 40rpx;
  border-radius: 999rpx;
  background-color: rgba(36, 28, 22, 0.92);
  z-index: 999;
  animation: toast-in 0.25s ease both;
}

.toast__text {
  font-size: 24rpx;
  color: #ffffff;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
