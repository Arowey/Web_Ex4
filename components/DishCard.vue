<template>
  <view class="card" hover-class="hover-dim" @tap="goDetail">
    <!-- 封面：用数据里的渐变 + emoji，不依赖任何图片 -->
    <view class="card__visual" :style="{ background: dish.gradient }">
      <text class="card__emoji">{{ dish.emoji }}</text>

      <!-- 收藏按钮在卡片内部，所以要 .stop 阻止冒泡，避免点爱心时跳详情 -->
      <view class="heart" :class="{ 'heart--on': liked }" @tap.stop="onHeart">
        <text class="heart__icon">♥</text>
      </view>

      <text class="card__price">¥{{ dish.price }}</text>
    </view>

    <view class="card__body">
      <view class="card__head">
        <text class="card__name">{{ dish.name }}</text>
        <text class="card__rating">{{ dish.rating }}</text>
      </view>

      <StarRating :model-value="dish.rating" readonly />

      <text class="card__canteen">{{ dish.canteen }}</text>

      <view class="card__tags">
        <BaseTag v-for="tag in dish.tags" :key="tag" :text="tag" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import BaseTag from './BaseTag.vue'
import StarRating from './StarRating.vue'
import { useFavorites } from '../utils/useFavorites.js'
import { useToast } from '../utils/useToast.js'

const props = defineProps({
  dish: { type: Object, required: true }
})

const { isFavorite, toggleFavorite } = useFavorites()
const { show } = useToast()

const liked = computed(() => isFavorite(props.dish.id))

// 全站唯一的跳转写法：uni.navigateTo + 页面路径 + query
function goDetail() {
  uni.navigateTo({ url: `/pages/detail/index?id=${props.dish.id}` })
}

function onHeart() {
  toggleFavorite(props.dish.id)
  show(liked.value ? `已收藏「${props.dish.name}」` : '已取消收藏')
}
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 28rpx;
  border: 1rpx solid #ece1d5;
  overflow: hidden;
}

.card__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220rpx;
}

.card__emoji {
  font-size: 96rpx;
  line-height: 1;
}

.heart {
  position: absolute;
  top: 14rpx;
  right: 14rpx;
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart__icon {
  font-size: 26rpx;
  color: #d9c6b4;
  line-height: 1;
}

.heart--on .heart__icon {
  color: #d9603b;
}

.card__price {
  position: absolute;
  left: 14rpx;
  bottom: 14rpx;
  padding: 2rpx 14rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 22rpx;
  font-weight: 700;
  color: #b94a2a;
}

.card__body {
  padding: 18rpx 20rpx 22rpx;
}

.card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.card__name {
  font-size: 28rpx;
  font-weight: 700;
  color: #241c16;
}

.card__rating {
  font-size: 22rpx;
  font-weight: 700;
  color: #f0a92e;
}

.card__canteen {
  display: block;
  margin: 8rpx 0 12rpx;
  font-size: 20rpx;
  color: #a08f80;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
