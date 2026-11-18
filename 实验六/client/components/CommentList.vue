<template>
  <view class="comments">
    <text v-if="comments.length === 0" class="comments__empty">
      还没有人留言，来做第一个吧。
    </text>

    <view v-for="item in comments" :key="item.id" class="comment">
      <view class="comment__avatar">
        <text class="comment__avatar-text">{{ item.name.slice(0, 1) }}</text>
      </view>

      <view class="comment__main">
        <view class="comment__head">
          <text class="comment__name">{{ item.name }}</text>
          <StarRating :model-value="item.rating" readonly />
          <text class="comment__time">{{ item.time }}</text>
        </view>
        <text class="comment__text">{{ item.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import StarRating from './StarRating.vue'

defineProps({
  comments: { type: Array, default: () => [] }
})
</script>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
}

.comments__empty {
  padding: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #a08f80;
  background-color: #ffffff;
  border: 1rpx dashed #ece1d5;
  border-radius: 28rpx;
}

.comment {
  display: flex;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  border-radius: 24rpx;
}

.comment__avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: #fdeee7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.comment__avatar-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #b94a2a;
}

.comment__main {
  flex: 1;
}

.comment__head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.comment__name {
  font-size: 26rpx;
  font-weight: 600;
  margin-right: 10rpx;
}

.comment__time {
  margin-left: auto;
  font-size: 20rpx;
  color: #a08f80;
}

.comment__text {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #6b5b4e;
}
</style>
