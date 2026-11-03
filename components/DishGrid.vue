<template>
  <!-- 只负责排版：两列瀑布式网格，卡片本身交给 DishCard -->
  <view class="grid">
    <view v-for="dish in dishes" :key="dish.id" class="grid__item">
      <DishCard :dish="dish" />
    </view>
  </view>
</template>

<script setup>
import DishCard from './DishCard.vue'

defineProps({
  dishes: { type: Array, default: () => [] }
})
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.grid__item {
  width: 48.6%;
  margin-bottom: 22rpx;
}
</style>
