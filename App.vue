<script>
// App.vue 是 uni-app 的应用入口，注意它没有 <template>：
// 页面由 pages.json 决定，App.vue 只负责应用级的生命周期和全局样式。
export default {
  // globalData 是跨页面共享数据最简单的方式（比 Vuex/Pinia 轻）
  globalData: {
    // 首页点了分类以后，把要筛的分类暂存在这里，菜单页 onShow 时取走
    pendingCategory: ''
  },
  onLaunch() {
    console.log('食光 · 应用启动')
  },
  onShow() {
    console.log('食光 · 回到前台')
  },
  onHide() {
    console.log('食光 · 进入后台')
  }
}
</script>

<style>
/* 全局样式：只写所有页面都要用的东西 */
page {
  background-color: #fbf6ef;
  color: #241c16;
  font-size: 28rpx;
  line-height: 1.7;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

view,
text,
input,
textarea,
button {
  box-sizing: border-box;
}

/* 通用容器：左右留白全站统一 */
.container {
  padding-left: 32rpx;
  padding-right: 32rpx;
}

/* 通用小工具类 */
.muted {
  color: #a08f80;
}

.text-brand {
  color: #d9603b;
}

/* hover-class 用的全局类：必须写在非 scoped 的样式里才生效 */
.hover-dim {
  opacity: 0.75;
}

/* 用电脑浏览器打开 H5 时，内容不要铺满整个屏幕 */
@media screen and (min-width: 768px) {
  .container,
  .hero {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  /* H5 的 tabBar 也是固定定位，宽屏时一起收窄居中 */
  uni-tabbar .uni-tabbar {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
