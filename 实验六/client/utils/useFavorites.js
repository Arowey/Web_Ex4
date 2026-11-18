/**
 * 收藏：本地先改，再同步到服务器
 *
 * 实验四的收藏只存在本机（uni.setStorageSync），换设备就没了；
 * 现在改成「服务器为准」：启动时拉一次，之后每次点击都发请求。
 *
 * 用的是「乐观更新」：先改界面再发请求，失败了再回滚 —— 这样点爱心没有延迟感。
 */
import { computed, reactive } from 'vue'
import { api } from './api.js'

const favoriteIds = reactive([])
let loading = false

/** 从服务器拉取本设备的收藏 */
async function load() {
  if (loading) return
  loading = true
  try {
    const data = await api.get('/favorites')
    favoriteIds.splice(0, favoriteIds.length, ...(data.ids || []))
  } catch (error) {
    // 服务器没起来时保持空列表，页面仍然能浏览
  } finally {
    loading = false
  }
}

export function useFavorites() {
  const isFavorite = (id) => favoriteIds.includes(id)

  /**
   * 切换收藏状态。
   * @param {number} id 菜品 id
   * @throws 网络失败时抛出，页面负责提示
   */
  async function toggleFavorite(id) {
    const index = favoriteIds.indexOf(id)
    const adding = index === -1

    // 1. 先改本地（界面立刻响应）
    if (adding) favoriteIds.push(id)
    else favoriteIds.splice(index, 1)

    // 2. 再发请求
    try {
      if (adding) await api.put(`/favorites/${id}`)
      else await api.del(`/favorites/${id}`)
    } catch (error) {
      // 3. 失败回滚，保证界面和服务器一致
      if (adding) {
        const back = favoriteIds.indexOf(id)
        if (back > -1) favoriteIds.splice(back, 1)
      } else {
        favoriteIds.push(id)
      }
      throw error
    }
  }

  const total = computed(() => favoriteIds.length)

  return { favoriteIds, isFavorite, toggleFavorite, total, load }
}
