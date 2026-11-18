<template>
  <view class="page">
    <HeroBanner v-if="todayPick" :greeting="greeting" :pick="todayPick" />

    <!-- 加载失败时的提示条 -->
    <view v-if="state.error" class="container">
      <view class="banner">
        <text class="banner__text">{{ state.error }}</text>
        <text class="banner__retry" @tap="reload">重试</text>
      </view>
    </view>

    <!-- 首次加载 -->
    <view v-if="state.loading && !state.dishes.length" class="container loading">
      <text class="loading__text">正在从服务器加载菜单…</text>
    </view>

    <template v-if="state.dishes.length">
      <!-- 数据统计：三个数字来自 /api/stats，收藏数来自本地状态 -->
      <view class="container section">
        <StatBar :items="stats" />
      </view>

      <!-- 分类入口 -->
      <view class="container section">
        <SectionTitle title="按分类逛" subtitle="点一下，直接跳到对应分类的菜单" />

        <view class="cats">
          <view
            v-for="item in mainCategories"
            :key="item"
            class="cat"
            hover-class="hover-dim"
            @tap="goCategory(item)"
          >
            <text class="cat__emoji">{{ categoryEmoji[item] }}</text>
            <text class="cat__name">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 本周推荐 -->
      <view class="container section">
        <SectionTitle title="本周推荐" subtitle="按评分排的前四名">
          <template #extra>
            <text class="more" @tap="goMenu">查看全部 →</text>
          </template>
        </SectionTitle>

        <DishGrid :dishes="recommended" />
      </view>

      <!-- 我的收藏 -->
      <view class="container section">
        <SectionTitle title="我的收藏" :subtitle="`已经收藏了 ${total} 道菜，换设备也还在`" />

        <DishGrid v-if="favoriteDishes.length" :dishes="favoriteDishes" />

        <EmptyState
          v-else
          emoji="♡"
          title="还没有收藏任何菜品"
          desc="在卡片右上角点一下爱心，就会出现在这里"
        >
          <BaseButton size="sm" variant="ghost" @tap="goMenu">去挑几道</BaseButton>
        </EmptyState>
      </view>

      <AppFooter />
    </template>

    <ToastMessage :visible="toast.visible" :text="toast.text" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../../utils/api.js'
import { useDishes } from '../../utils/useDishes.js'
import { useFavorites } from '../../utils/useFavorites.js'
import { useToast } from '../../utils/useToast.js'
import HeroBanner from '../../components/HeroBanner.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import StatBar from '../../components/StatBar.vue'
import DishGrid from '../../components/DishGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import BaseButton from '../../components/BaseButton.vue'
import AppFooter from '../../components/AppFooter.vue'
import ToastMessage from '../../components/ToastMessage.vue'

const { state, load } = useDishes()
const { favoriteIds, total, load: loadFavorites } = useFavorites()
const { toast } = useToast()

// 1. 问候语：页面加载后按当前时间算
const greeting = ref('你好')
onMounted(() => {
  const hour = new Date().getHours()
  if (hour < 11) greeting.value = '早上好'
  else if (hour < 14) greeting.value = '中午好'
  else if (hour < 18) greeting.value = '下午好'
  else greeting.value = '晚上好'
})

// 2. 服务端聚合出来的统计数字
const remoteStats = ref({ dishes: 0, canteens: 0, averageRating: 0, comments: 0 })

async function loadStats() {
  try {
    remoteStats.value = await api.get('/stats')
  } catch (error) {
    // 统计失败不影响主体内容，保持 0 即可
  }
}

onMounted(() => {
  load()
  loadStats()
  loadFavorites()
})

function reload() {
  load(true)
  loadStats()
  loadFavorites()
}

// 3. 今日主推：用「今天是几号」当下标，每天自动换一道
const todayPick = computed(() => {
  if (state.dishes.length === 0) return null
  return state.dishes[new Date().getDate() % state.dishes.length]
})

// 4. 四格统计
const stats = computed(() => [
  { label: '收录菜品', value: remoteStats.value.dishes, unit: '道' },
  { label: '覆盖食堂', value: remoteStats.value.canteens, unit: '个' },
  { label: '平均评分', value: Number(remoteStats.value.averageRating).toFixed(1), unit: '分' },
  { label: '我的收藏', value: total.value, unit: '道' }
])

// 5. 本周推荐：评分最高的四道
const recommended = computed(() =>
  [...state.dishes].sort((a, b) => b.rating - a.rating).slice(0, 4)
)

// 6. 我的收藏：用收藏 id 在已加载的菜品里筛
const favoriteDishes = computed(() =>
  state.dishes.filter((dish) => favoriteIds.includes(dish.id))
)

const categoryEmoji = {
  面食: '🍜',
  米饭: '🍚',
  小吃: '🍢',
  甜品: '🍮',
  饮品: '🍋'
}

const mainCategories = computed(() => state.categories.filter((item) => item !== '全部'))

// tabBar 页面不能带参数跳转，所以把分类暂存到 globalData，菜单页 onShow 时取走
function goCategory(item) {
  getApp().globalData.pendingCategory = item
  uni.switchTab({ url: '/pages/menu/index' })
}

function goMenu() {
  uni.switchTab({ url: '/pages/menu/index' })
}
</script>

<style scoped>
.page {
  padding-bottom: 40rpx;
}

.section {
  margin-top: 56rpx;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
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

.loading {
  padding: 120rpx 0;
  text-align: center;
}

.loading__text {
  font-size: 24rpx;
  color: #a08f80;
}

.cats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.cat {
  width: 19%;
  height: 128rpx;
  margin-bottom: 16rpx;
  border-radius: 28rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cat__emoji {
  font-size: 44rpx;
  line-height: 1;
}

.cat__name {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #6b5b4e;
}

.more {
  font-size: 24rpx;
  color: #d9603b;
}
</style>
