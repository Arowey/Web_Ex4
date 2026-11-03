<template>
  <text class="tag" :class="`tag--${tone}`">{{ text }}</text>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  // soft 浅色底 / line 描边
  tone: { type: String, default: 'soft' }
})
</script>

<style scoped>
.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  line-height: 1.6;
}

.tag--soft {
  background-color: #fdeee7;
  color: #b94a2a;
}

.tag--line {
  border: 1rpx solid #ece1d5;
  color: #6b5b4e;
}
</style>
