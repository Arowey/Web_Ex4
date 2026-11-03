<template>
  <!-- 通用按钮：用 view 模拟按钮，hover-class 是 uni-app 的按下反馈 -->
  <view
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'btn--disabled': disabled }]"
    :hover-class="disabled ? 'none' : 'hover-dim'"
    @tap="onTap"
  >
    <slot />
  </view>
</template>

<script setup>
const props = defineProps({
  // primary 主按钮 / ghost 次要按钮
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false }
})

const emit = defineEmits(['tap'])

function onTap() {
  if (!props.disabled) emit('tap')
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
}

.btn--md {
  padding: 26rpx 48rpx;
}

.btn--sm {
  padding: 16rpx 30rpx;
  font-size: 24rpx;
}

.btn--block {
  width: 100%;
}

.btn--primary {
  background-color: #d9603b;
  color: #ffffff;
  box-shadow: 0 10rpx 24rpx rgba(217, 96, 59, 0.24);
}

.btn--ghost {
  background-color: transparent;
  color: #6b5b4e;
  border: 1rpx solid #ece1d5;
}

.btn--disabled {
  opacity: 0.45;
}
</style>
