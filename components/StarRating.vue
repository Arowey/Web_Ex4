<template>
  <view class="stars">
    <text
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ 'star--on': n <= filled, 'star--clickable': !readonly }"
      @tap="pick(n)"
    >
      ★
    </text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 支持 v-model：<StarRating v-model="form.rating" />
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['update:modelValue'])

// 4.7 分四舍五入成 5 颗亮星，放在 computed 里比模板里写 Math 更清楚
const filled = computed(() => Math.round(props.modelValue))

function pick(n) {
  if (!props.readonly) emit('update:modelValue', n)
}
</script>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
}

.star {
  font-size: 26rpx;
  color: #e3d6c8;
  margin-right: 2rpx;
}

.star--on {
  color: #f0a92e;
}

.star--clickable {
  font-size: 44rpx;
  margin-right: 8rpx;
}
</style>
