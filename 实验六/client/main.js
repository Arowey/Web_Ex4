import App from './App'
import { createSSRApp } from 'vue'

// uni-app 的入口和普通 Vue 不一样：
// 不直接 createApp().mount()，而是导出一个 createApp 函数交给 uni 运行时
export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
