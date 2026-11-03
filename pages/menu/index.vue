<template>
  <view class="page container">
    <view class="head">
      <text class="head__title">美食菜单</text>
      <text class="head__sub">共 {{ dishes.length }} 道菜，按分类、关键词、收藏状态随便筛</text>
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
        <text>找到 </text>
        <text class="result__num">{{ filteredDishes.length }}</text>
        <text> 道菜</text>
        <text v-if="category !== '全部'" class="result__tag"> · 分类「{{ category }}」</text>
      </view>

      <text v-if="hasFilter" class="result__reset" @tap="resetFilter">清空筛选</text>
    </view>

    <DishGrid v-if="filteredDishes.length" :dishes="filteredDishes" />

    <EmptyState
      v-else
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
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { categories, dishes } from '../../utils/dishes.js'
import { useFavorites } from '../../utils/useFavorites.js'
import { useToast } from '../../utils/useToast.js'
import SearchBar from '../../components/SearchBar.vue'
import CategoryTabs from '../../components/CategoryTabs.vue'
import DishGrid from '../../components/DishGrid.vue'
import EmptyState from '../../components/EmptyState.vue'
import BaseButton from '../../components/BaseButton.vue'
import AppFooter from '../../components/AppFooter.vue'
import ToastMessage from '../../components/ToastMessage.vue'

const { isFavorite } = useFavorites()
const { toast } = useToast()

const keyword = ref('')
const category = ref('全部')
const sortIndex = ref(0)
const onlyFavorite = ref(false)

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'rating', label: '评分优先' },
  { value: 'priceAsc', label: '价格从低到高' },
  { value: 'priceDesc', label: '价格从高到低' }
]
const sortLabels = sortOptions.map((item) => item.label)

// 首页点了分类会先把分类写进 globalData，这里每次显示页面时取一次
onShow(() => {
  const app = getApp()
  const pending = app.globalData.pendingCategory
  if (pending) {
    category.value = pending
    app.globalData.pendingCategory = ''
  }
})

function onSortChange(event) {
  sortIndex.value = Number(event.detail.value)
}

function onFavoriteChange(event) {
  onlyFavorite.value = event.detail.value
}

// 筛选 + 排序，一个 computed 全算完
const filteredDishes = computed(() => {
  const word = keyword.value.trim()

  let list = dishes.filter((dish) => {
    const matchCategory = category.value === '全部' || dish.category === category.value
    const matchKeyword =
      word === '' ||
      dish.name.includes(word) ||
      dish.desc.includes(word) ||
      dish.canteen.includes(word) ||
      dish.tags.some((tag) => tag.includes(word))
    const matchFavorite = !onlyFavorite.value || isFavorite(dish.id)

    return matchCategory && matchKeyword && matchFavorite
  })

  const sort = sortOptions[sortIndex.value].value
  if (sort === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating)
  } else if (sort === 'priceAsc') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (sort === 'priceDesc') {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  return list
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
</style>
