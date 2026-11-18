/**
 * 菜品数据：现在从后端来
 *
 * 和实验四的区别：以前是 import 一个静态数组，现在是启动时请求 /api/dishes。
 * 仍然是「模块级单例」，三个页面共享同一份，谁也不用重复请求。
 */
import { computed, reactive } from 'vue'
import { api } from './api.js'

const state = reactive({
  dishes: [],
  categories: ['全部'],
  loading: false,
  error: '',
  loaded: false
})

/**
 * 拉取菜品列表。
 * @param {boolean} [force] 为 true 时忽略缓存重新请求
 */
async function load(force = false) {
  if (state.loading) return
  if (state.loaded && !force) return

  state.loading = true
  state.error = ''
  try {
    const data = await api.get('/dishes')
    state.dishes.splice(0, state.dishes.length, ...data.items)
    state.categories = data.categories
    state.loaded = true
  } catch (error) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

export function useDishes() {
  return {
    state,
    load,
    dishes: computed(() => state.dishes)
  }
}
