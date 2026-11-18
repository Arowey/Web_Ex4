<template>
  <view class="page container">
    <view class="head">
      <text class="head__title">美食菜单</text>
      <text class="head__sub">筛选和排序都交给服务端，输入停下 300 毫秒才发请求</text>
    </view>

    <!-- 工具栏 -->
    <view class="toolbar">
      <SearchBar v-model="keyword" placeholder="搜菜名、食堂或标签，比如「牛肉」" />

      <view class="toolbar__row">
        <!-- 原生 picker 做下拉选择 -->
        <picker
          class="sort"
          mode="selector"
          :range="sortLabels"
          :value="sortIndex"
          @change="onSortChange"
        >
          <view class="sort__inner">
            <text class="sort__text">{{ sortLabels[sortIndex] }}</text>
            <text class="sort__arrow">▾</text>
          </view>
        </picker>

        <view class="switch-row">
          <text class="switch-row__label">只看收藏</text>
          <switch
            :checked="onlyFavorite"
            color="#d9603b"
            style="transform: scale(0.7)"
            @change="onFavoriteChange"
          />
        </view>
      </view>

      <CategoryTabs v-model="category" :categories="categories" />
    </view>

    <!-- 结果统计 -->
    <view class="result">
      <view class="result__text">
        <text v-if="loading">正在查询…</text>
        <template v-else>
          <text>找到 </text>
          <text class="result__num">{{ filteredDishes.length }}</text>
          <text> 道菜</text>
          <text v-if="category !== '全部'" class="result__tag"> · 分类「{{ category }}」</text>
        </template>
      </view>

      <text v-if="hasFilter" class="result__reset" @tap="resetFilter">清空筛选</text>
    </view>

    <view v-if="error" class="banner">
      <text class="banner__text">{{ error }}</text>
      <text class="banner__retry" @tap="fetchList">重试</text>
    </view>

    <DishGrid v-if="filteredDishes.length" :dishes="filteredDishes" />

    <EmptyState
      v-else-if="!loading"
      emoji="🔍"
      title="没有找到符合条件的菜"
      desc="换个关键词，或者清空筛选条件再看看"
    >
      <BaseButton size="sm" variant="ghost" @tap="resetFilter">清空筛选</BaseButton>
    </EmptyState>

    <AppFooter />

    <ToastMessage :visible="toast.visible" :text="toast.text" />
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '../../utils/api.js'
import { useFavorites } from '../../utils/useFavorites.js'
import { useToast } from '../../utils/useToast.js'
import SearchBar from '../../components/SearchBar.vue'
import CategoryTabs from '../../components/CategoryTabs.vue'
import DishGrid from '../../components/DishGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import BaseButton from '../../components/BaseButton.vue'
import AppFooter from '../../components/AppFooter.vue'
import ToastMessage from '../../components/ToastMessage.vue'

const { isFavorite, load: loadFavorites } = useFavorites()
const { toast } = useToast()

const keyword = ref('')
const category = ref('全部')
const sortIndex = ref(0)
const onlyFavorite = ref(false)

const list = ref([])
const categories = ref(['全部'])
const loading = ref(false)
const error = ref('')

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'rating', label: '评分优先' },
  { value: 'priceAsc', label: '价格从低到高' },
  { value: 'priceDesc', label: '价格从高到低' }
]
const sortLabels = sortOptions.map((item) => item.label)

/**
 * 向后端要数据。
 * 三个筛选条件都作为 query 参数传过去，服务端负责筛选和排序。
 */
async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/dishes', {
      keyword: keyword.value.trim(),
      category: category.value,
      sort: sortOptions[sortIndex.value].value
    })
    list.value = data.items
    categories.value = data.categories
  } catch (requestError) {
    error.value = requestError.message
    list.value = []
  } finally {
    loading.value = false
  }
}

// 输入时不要每敲一个字就发一次请求，停 300 毫秒再发
let debounceTimer = null
watch([keyword, category, sortIndex], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchList, 300)
})

// tabBar 页面只创建一次，每次显示都要检查首页有没有传来分类
onShow(() => {
  loadFavorites()
  const app = getApp()
  const pending = app.globalData.pendingCategory
  if (pending) {
    app.globalData.pendingCategory = ''
    category.value = pending // 赋值会触发 watch，自动拉数据
    return
  }
  if (list.value.length === 0) fetchList()
})

function onSortChange(event) {
  sortIndex.value = Number(event.detail.value)
}

function onFavoriteChange(event) {
  onlyFavorite.value = event.detail.value
}

// 「只看收藏」在客户端过滤：收藏是一组 id，和后端返回的列表取交集
const filteredDishes = computed(() => {
  if (!onlyFavorite.value) return list.value
  return list.value.filter((dish) => isFavorite(dish.id))
})

const hasFilter = computed(
  () => keyword.value !== '' || category.value !== '全部' || onlyFavorite.value
)

function resetFilter() {
  keyword.value = ''
  category.value = '全部'
  sortIndex.value = 0
  onlyFavorite.value = false
}
</script>

<style scoped>
.page {
  padding-top: 32rpx;
}

.head__title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #241c16;
}

.head__sub {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b5b4e;
}

.toolbar {
  margin: 28rpx 0 20rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border: 1rpx solid #ece1d5;
  border-radius: 28rpx;
}

.toolbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 0 16rpx;
}

.sort__inner {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 24rpx;
  border: 1rpx solid #ece1d5;
  border-radius: 999rpx;
}

.sort__text {
  font-size: 24rpx;
  color: #6b5b4e;
}

.sort__arrow {
  margin-left: 8rpx;
  font-size: 20rpx;
  color: #a08f80;
}

.switch-row {
  display: flex;
  align-items: center;
}

.switch-row__label {
  font-size: 24rpx;
  color: #6b5b4e;
}

.result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: #a08f80;
}

.result__num {
  font-size: 28rpx;
  font-weight: 700;
  color: #241c16;
}

.result__tag {
  color: #a08f80;
}

.result__reset {
  font-size: 24rpx;
  color: #d9603b;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
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
</style>
