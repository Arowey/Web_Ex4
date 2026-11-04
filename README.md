# 食光 · 校园美食手账（uni-app 版）

> 南华大学《Web 全栈开发》实验四 —— Vue + uni-app
> 由实验三的 Vue 3 网页项目迁移而来，一套代码同时跑 H5、微信小程序、Android

---

## 一、用 HBuilderX 打开（推荐，也是作业要求的方式）

1. 到 <https://www.dcloud.io/hbuilderx.html> 下载 **HBuilderX（App 开发版）**，解压即用，不用安装。
2. 打开 HBuilderX → 菜单 **文件 → 导入 → 从本地目录导入** → 选中本文件夹（`实验四`）。
3. 项目会出现在左侧项目树里，双击 `pages/home/index.vue` 就能看到代码。

> 不需要 `npm install`，HBuilderX 自带编译环境。

## 二、运行到不同终端

| 终端 | 操作 | 前置条件 |
| --- | --- | --- |
| **H5（浏览器）** | 菜单 **运行 → 运行到浏览器 → Chrome** | 无 |
| **微信小程序** | 菜单 **运行 → 运行到小程序模拟器 → 微信开发者工具** | 装好[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，并在 HBuilderX 的「设置 → 运行配置」里填它的安装路径 |
| **Android App** | 手机开 USB 调试并连电脑 → 菜单 **运行 → 运行到手机或模拟器 → 运行到 Android App 基座** | 手机装好「HBuilder 基座」；首次运行会自动安装 |
| **iOS** | 同上，选 iOS 基座 | 需要 Mac 或 iOS 真机调试证书 |

**微信小程序第一次运行会要 AppID**：`manifest.json → 微信小程序配置 → AppID` 填自己的；
没有的话去 [mp.weixin.qq.com](https://mp.weixin.qq.com) 申请一个测试号，或者直接在微信开发者工具里选「测试号」。

## 三、发布

| 目标 | 操作 | 产物 |
| --- | --- | --- |
| **H5 网站** | 菜单 **发行 → 网站-PC Web 或手机 H5** | `unpackage/dist/build/h5`，丢到任意静态服务器 |
| **微信小程序** | 菜单 **发行 → 小程序-微信**，会自动调起开发者工具上传 | 在微信公众平台提交审核后发布 |
| **Android App** | 菜单 **发行 → 原生 App-云打包**（选 Android，用 DCloud 公共证书即可） | `.apk`，可直接安装 |

> 命令行方式（可选）：本目录也能用 CLI 跑，见文末「附：命令行构建」。

### 3.1 最快拿到公网链接：H5 发到 GitHub Pages

项目里的 **`docs/` 目录已经是打包好的 H5 站点**（相对路径，子目录部署也能跑），
不用再发行一次，推上去打开 Pages 就有链接：

1. 在 GitHub 网页上新建一个空仓库（本项目用的是 `Web_Ex4`），**不要**勾选 Add README；
2. 在本目录执行（本仓库已经推过一次，重装系统后照这个来）：

```bash
git init
git add .
git commit -m "实验四：Vue + uni-app 校园美食手账"
git branch -M main
git remote add origin https://github.com/Arowey/Web_Ex4.git
git push -u origin main
```

3. 仓库 **Settings → Pages → Source 选 Deploy from a branch → main / docs → Save**；
4. 等 1～2 分钟，访问 <https://arowey.github.io/Web_Ex4/>。

> 如果 push 报 SSL 证书错误，用 `git -c http.sslVerify=false push -u origin main`。
>
> 自己重新发行过 H5 的话，把 `unpackage/dist/build/h5` 里的文件覆盖到 `docs/` 再提交即可。
> 部署在子目录时 `base` 必须是相对路径，命令行构建已经配好（`vite.config.js` 里 `base: './'`）。

### 3.2 发微信小程序

1. 先去 [mp.weixin.qq.com](https://mp.weixin.qq.com) 注册小程序，拿到 AppID；
2. 填到 `manifest.json → mp-weixin → appid`；
3. HBuilderX：**发行 → 小程序-微信（仅适用于uni-app）**，会编译并调起微信开发者工具；
4. 在开发者工具里点「上传」，填版本号；
5. 到公众平台「版本管理」里提交审核，通过后点「发布」。

> 个人号也能发，但审核需要时间；只是交作业的话，用「体验版」把二维码给老师扫也能看。

### 3.3 打 Android 安装包

1. 注册 [DCloud 开发者](https://dev.dcloud.net.cn/) 并登录 HBuilderX（右上角头像）；
2. **发行 → 原生 App-云打包**，选 Android；
3. 证书选「使用 DCloud 公用测试证书」，勾选「安心打包」；
4. 提交后等几分钟，控制台会给下载链接，产物在 `unpackage/release/apk/`。

> 免费用户每天有打包次数限制，排队时间看运气。只是演示的话，直接用「运行到手机」比打包快得多。

## 四、目录结构

```
实验四/
├── pages.json            # 页面路由 + 导航栏 + tabBar（相当于 vue-router 的路由表）
├── manifest.json         # 应用配置：名称、图标、各端 AppID
├── App.vue               # 应用入口（没有 template），全局样式与 globalData
├── main.js               # createSSRApp 导出 createApp
├── uni.scss              # 全局样式变量
├── index.html            # H5 的模板页
├── pages/
│   ├── home/index.vue    # 首页
│   ├── menu/index.vue    # 菜单页
│   └── detail/index.vue  # 详情页（?id=2）
├── components/           # 15 个可复用组件
├── utils/
│   ├── dishes.js         # 12 条菜品数据
│   ├── useFavorites.js   # 收藏状态（uni 存储）
│   └── useToast.js       # 轻提示状态
├── static/tabbar/        # tabBar 图标
└── docs/                 # 打包好的 H5 站点（发 GitHub Pages 用）
```

组件清单：BaseButton、BaseTag、StarRating、DishCard、DishGrid、SearchBar、
CategoryTabs、EmptyState、SectionTitle、StatBar、CommentList、CommentForm、
ToastMessage、AppFooter、HeroBanner —— 15 个，加上 3 个页面和 App.vue 共 19 个单文件组件。

## 五、和实验三的 Vue 项目相比，改了什么

| Web 版（实验三） | uni-app 版（实验四） | 为什么必须改 |
| --- | --- | --- |
| `vue-router` 的 `router-link` | `@tap` + `uni.navigateTo / switchTab` | 小程序没有浏览器地址栏 |
| `useRoute().params.id` | `onLoad(options)` | 页面参数由 uni 运行时传入 |
| `localStorage` | `uni.getStorageSync / setStorageSync` | 小程序没有 localStorage |
| `event.target.value` | `event.detail.value` | 小程序事件对象结构不同 |
| `<div> <p> <span> <a>` | `<view> <text>` | 小程序只有内置组件 |
| `<transition>` 页面动画 | CSS `animation` | 小程序不支持 Vue 的 transition |
| `position: sticky`、`backdrop-filter` | 去掉 | 小程序不支持 |
| `px` | `rpx` | 750rpx = 屏幕宽度，自适应 |
| `:root { --brand }` | 直接写颜色值 | 小程序没有 `:root` |
| `App.vue` 带 `<template>` | 没有 `<template>` | uni-app 的 App.vue 只放全局逻辑 |

逐部分讲解（含每节的知识点清单）见 **`项目讲解.md`**，迁移对照与答辩问题见 **`迁移说明.md`**。

## 附：命令行构建（可选，需要 Node）

```bash
npm i -D @dcloudio/vite-plugin-uni@3.0.0-5030420261029002 vite@5.2.8
npm i @dcloudio/uni-app@3.0.0-5030420261029002 @dcloudio/uni-h5@3.0.0-5030420261029002 vue@^3.4.21
npx uni build          # H5
npx uni build -p mp-weixin   # 微信小程序
```

用 HBuilderX 的话完全不需要这一步。
