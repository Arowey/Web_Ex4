<template>
  <view class="footer">
    <text class="footer__title">食光 · 校园美食手账</text>
    <text class="footer__desc">记录食堂里那些值得再吃一次的窗口</text>
    <text class="footer__copy">© 2026 南华大学 · Web 全栈开发课程作业</text>
  </view>
</template>

<script setup>
// 纯展示组件，没有逻辑
</script>

<style scoped>
.footer {
  margin-top: 60rpx;
  padding: 48rpx 0 40rpx;
  border-top: 1rpx solid #ece1d5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer__title {
  font-size: 26rpx;
  font-weight: 700;
  color: #241c16;
}

.footer__desc {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #a08f80;
}

.footer__copy {
  margin-top: 18rpx;
  font-size: 20rpx;
  color: #b8a897;
}
</style>
