/**
 * 轻提示的共享状态
 *
 * 用法：const { show } = useToast(); show('已收藏')
 * 真正负责显示的是 components/ToastMessage.vue，写在首页/菜单页/详情页的模板末尾。
 */
import { reactive } from 'vue'

const toast = reactive({
  visible: false,
  text: ''
})

let timer = null

export function useToast() {
  function show(text, duration = 1800) {
    toast.text = text
    toast.visible = true

    // 连续点击时重置计时，避免上一条的定时器把新的提前关掉
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      toast.visible = false
      timer = null
    }, duration)
  }

  return { toast, show }
}
