<template>
  <view class="page">
    <!-- 加载中 -->
    <view v-if="loading" class="container loading">
      <text class="loading__text">正在从服务器加载…</text>
    </view>

    <!-- 请求失败 -->
    <view v-else-if="error" class="container">
      <view class="banner">
        <text class="banner__text">{{ error }}</text>
        <text class="banner__retry" @tap="loadDish">重试</text>
      </view>
    </view>

    <template v-else-if="dish">
      <!-- 封面 -->
      <view class="hero" :style="{ background: dish.gradient }">
        <text class="hero__emoji">{{ dish.emoji }}</text>
        <text class="hero__price">¥{{ dish.price }}</text>
      </view>

      <view class="container">
        <!-- 基本信息 -->
        <view class="info">
          <view class="info__tags">
            <BaseTag :text="dish.category" tone="line" />
            <BaseTag v-for="tag in dish.tags" :key="tag" :text="tag" />
          </view>

          <text class="info__name">{{ dish.name }}</text>

          <view class="info__rating">
            <StarRating :model-value="dish.rating" readonly />
            <text class="info__score">{{ dish.rating }}</text>
            <text class="info__count">· {{ comments.length }} 条评论</text>
          </view>

          <text class="info__canteen">📍 {{ dish.canteen }}</text>
          <text class="info__desc">{{ dish.desc }}</text>
          <text class="info__story">{{ dish.story }}</text>

          <view class="info__actions">
            <view class="info__action">
              <BaseButton @tap="onFavorite">{{ liked ? '♥ 已收藏' : '♡ 收藏这道菜' }}</BaseButton>
            </view>
            <view class="info__action">
              <BaseButton variant="ghost" @tap="goMenu">继续逛逛</BaseButton>
            </view>
          </view>
        </view>

        <!-- 评论区 -->
        <view class="section">
          <SectionTitle title="吃后感" :subtitle="`共 ${comments.length} 条，欢迎补充你的版本`" />
          <CommentForm @submit="addComment" />
          <view class="comments">
            <CommentList :comments="comments" />
          </view>
        </view>

        <!-- 同类推荐 -->
        <view v-if="related.length" class="section">
          <SectionTitle title="同类推荐" subtitle="和这道菜同一个分类" />
          <DishGrid :dishes="related" />
        </view>

        <AppFooter />
      </view>
    </template>

    <!-- 地址里的 id 找不到对应菜品 -->
    <view v-else class="container">
      <EmptyState
        emoji="🥢"
        title="这道菜好像下架了"
        desc="地址里的编号找不到对应的菜品，回菜单页看看吧"
      >
        <BaseButton size="sm" @tap="goMenu">回到菜单</BaseButton>
      </EmptyState>
    </view>

    <ToastMessage :visible="toast.visible" :text="toast.text" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { api } from '../../utils/api.js'
import { useDishes } from '../../utils/useDishes.js'
import { useFavorites } from '../../utils/useFavorites.js'
import { useToast } from '../../utils/useToast.js'
import BaseButton from '../../components/BaseButton.vue'
import BaseTag from '../../components/BaseTag.vue'
import StarRating from '../../components/StarRating.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import CommentList from '../../components/CommentList.vue'
import CommentForm from '../../components/CommentForm.vue'
import DishGrid from '../../components/DishGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import AppFooter from '../../components/AppFooter.vue'
import ToastMessage from '../../components/ToastMessage.vue'

const { state, load } = useDishes()
const { isFavorite, toggleFavorite, load: loadFavorites } = useFavorites()
const { toast, show } = useToast()

const dishId = ref(0)
const dish = ref(null)
const comments = ref([])
const loading = ref(true)
const error = ref('')

/** 从接口拉这道菜（评论一起返回） */
async function loadDish() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get(`/dishes/${dishId.value}`)
    dish.value = data
    comments.value = data.comments || []
  } catch (requestError) {
    error.value = requestError.message
    dish.value = null
  } finally {
    loading.value = false
  }
}

// 页面参数：uni-app 用 onLoad(options) 取，不是 vue-router 的 useRoute()
onLoad((options) => {
  dishId.value = Number(options.id || 0)
  loadDish()
  // 同类推荐要用整个列表，顺手加载一下
  load()
  loadFavorites()
})

const liked = computed(() => (dish.value ? isFavorite(dish.value.id) : false))

// 同类推荐：同分类的其他菜，最多两道
const related = computed(() => {
  if (!dish.value) return []
  return state.dishes
    .filter((item) => item.category === dish.value.category && item.id !== dish.value.id)
    .slice(0, 2)
})

async function onFavorite() {
  if (!dish.value) return

  const willAdd = !liked.value
  try {
    await toggleFavorite(dish.value.id)
    show(willAdd ? `已收藏「${dish.value.name}」` : '已取消收藏')
  } catch (requestError) {
    show(requestError.message)
  }
}

/**
 * 发评论：POST 到服务端，成功后把服务端返回的那条插到最前面。
 * 不用本地拼一条再假装成功 —— 以服务端返回的数据为准。
 */
async function addComment(payload) {
  try {
    const created = await api.post(`/dishes/${dishId.value}/comments`, payload)
    comments.value.unshift(created)
    show('评论已发表，谢谢分享')
  } catch (requestError) {
    show(requestError.message)
  }
}

function goMenu() {
  uni.switchTab({ url: '/pages/menu/index' })
}
</script>

<style scoped>
.page {
  padding-bottom: 40rpx;
}

.loading {
  padding: 200rpx 0;
  text-align: center;
}

.loading__text {
  font-size: 24rpx;
  color: #a08f80;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40rpx;
  padding: 20rpx 24rpx;
  background-color: #fdeee7;
  border: 1rpx solid #f5d6c8;
  border-radius: 20rpx;
}

.banner__text {
  flex: 1;
  font-size: 22rpx;
  color: #b94a2a;
}

.banner__retry {
  margin-left: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #d9603b;
}

.hero {
  position: relative;
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__emoji {
  font-size: 200rpx;
  line-height: 1;
}

.hero__price {
  position: absolute;
  left: 40rpx;
  bottom: 96rpx;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
  font-weight: 700;
  color: #b94a2a;
}

.info {
  position: relative;
  z-index: 2;
  margin-top: -40rpx;
  padding: 32rpx;
  background-color: #ffffff;
  border-radius: 32rpx;
  border: 1rpx solid #ece1d5;
}

.info__tags {
  display: flex;
  flex-wrap: wrap;
}

.info__name {
  display: block;
  margin-top: 18rpx;
  font-size: 48rpx;
  font-weight: 700;
  color: #241c16;
}

.info__rating {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.info__score {
  margin-left: 10rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #f0a92e;
}

.info__count {
  margin-left: 8rpx;
  font-size: 22rpx;
  color: #a08f80;
}

.info__canteen {
  display: block;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #6b5b4e;
}

.info__desc {
  display: block;
  margin-top: 14rpx;
  font-size: 28rpx;
  color: #6b5b4e;
}

.info__story {
  display: block;
  margin-top: 20rpx;
  padding: 18rpx 22rpx;
  background-color: #fdf8f3;
  border-left: 6rpx solid #d9603b;
  border-radius: 0 16rpx 16rpx 0;
  font-size: 24rpx;
  color: #6b5b4e;
}

.info__actions {
  display: flex;
  margin-top: 28rpx;
}

.info__action {
  margin-right: 20rpx;
}

.section {
  margin-top: 48rpx;
}

.comments {
  margin-top: 20rpx;
}
</style>
