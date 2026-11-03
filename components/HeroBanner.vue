<template>
  <view class="hero">
    <text class="hero__greeting">{{ greeting }}，今天想吃点什么？</text>

    <view class="hero__title">
      <text class="hero__title-text">把食堂里</text>
      <text class="hero__title-text hero__title-brand">值得再吃一次</text>
      <text class="hero__title-text">的窗口都记在这里</text>
    </view>

    <!-- 今日主推：每天换一道（用日期做下标） -->
    <view class="pick" hover-class="hover-dim" @tap="goPick">
      <view class="pick__visual" :style="{ background: pick.gradient }">
        <text class="pick__emoji">{{ pick.emoji }}</text>
      </view>

      <view class="pick__info">
        <text class="pick__label">今日主推</text>
        <text class="pick__name">{{ pick.name }}</text>
        <view class="pick__meta">
          <StarRating :model-value="pick.rating" readonly />
          <text class="pick__price">¥{{ pick.price }}</text>
        </view>
        <text class="pick__canteen">{{ pick.canteen }}</text>
      </view>
    </view>

    <view class="hero__actions">
      <view class="hero__action">
        <BaseButton size="sm" @tap="goMenu">浏览全部菜单</BaseButton>
      </view>
      <view class="hero__action">
        <BaseButton size="sm" variant="ghost" @tap="goPick">看看今日主推</BaseButton>
      </view>
    </view>
  </view>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  greeting: { type: String, default: '你好' },
  pick: { type: Object, required: true }
})

// tabBar 页面之间切换必须用 switchTab，不能用 navigateTo
function goMenu() {
  uni.switchTab({ url: '/pages/menu/index' })
}

function goPick() {
  uni.navigateTo({ url: `/pages/detail/index?id=${props.pick.id}` })
}
</script>

<style scoped>
.hero {
  padding: 40rpx 32rpx 8rpx;
}

.hero__greeting {
  display: inline-block;
  padding: 8rpx 22rpx;
  border-radius: 999rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  font-size: 22rpx;
  color: #6b5b4e;
}

.hero__title {
  margin-top: 22rpx;
}

.hero__title-text {
  display: block;
  font-size: 52rpx;
  line-height: 1.36;
  font-weight: 700;
  color: #241c16;
}

.hero__title-brand {
  color: #d9603b;
}

.pick {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  padding: 24rpx;
  border-radius: 32rpx;
  background-color: #fff3e2;
  border: 1rpx solid #f5dfc6;
}

.pick__visual {
  width: 180rpx;
  height: 180rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.pick__emoji {
  font-size: 96rpx;
  line-height: 1;
}

.pick__info {
  flex: 1;
}

.pick__label {
  font-size: 20rpx;
  color: #b94a2a;
  letter-spacing: 4rpx;
}

.pick__name {
  display: block;
  margin-top: 6rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #241c16;
}

.pick__meta {
  display: flex;
  align-items: center;
  margin-top: 6rpx;
}

.pick__price {
  margin-left: 14rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #b94a2a;
}

.pick__canteen {
  display: block;
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #9c7a5c;
}

.hero__actions {
  display: flex;
  margin-top: 28rpx;
}

.hero__action {
  margin-right: 20rpx;
}
</style>
