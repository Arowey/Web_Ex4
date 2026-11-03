/**
 * 收藏功能的共享状态（组合式函数）
 *
 * 和 Web 版唯一的区别：localStorage 换成了 uni 的存储 API。
 * uni.setStorageSync / uni.getStorageSync 在 H5、小程序、App 里都能用，
 * 所以这一段代码在四个端上是同一份。
 */
import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'shiguang-favorites'

function loadFromStorage() {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY)
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    return []
  }
}

// 模块级响应式数组：整个应用只有一份，任何页面改它，别的页面立刻同步
const favoriteIds = reactive(loadFromStorage())

// 收藏一变就写回本地存储
watch(
  favoriteIds,
  (ids) => {
    try {
      uni.setStorageSync(STORAGE_KEY, [...ids])
    } catch (error) {
      // 存储写失败不影响页面使用，忽略即可
    }
  },
  { deep: true }
)

export function useFavorites() {
  const isFavorite = (id) => favoriteIds.includes(id)

  function toggleFavorite(id) {
    const index = favoriteIds.indexOf(id)
    if (index > -1) {
      favoriteIds.splice(index, 1)
    } else {
      favoriteIds.push(id)
    }
  }

  const total = computed(() => favoriteIds.length)

  return { favoriteIds, isFavorite, toggleFavorite, total }
}
