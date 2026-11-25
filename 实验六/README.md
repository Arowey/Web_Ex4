# 食光 · Express 后端

> 南华大学《Web 全栈开发》实验六
> 给实验四的 uni-app 前端加上 Express 后端：菜品、评论、收藏、统计全部走接口，数据落到磁盘。

逐部分讲解（含每节的知识点清单）见 **`项目讲解.md`**。

---

## 一、怎么跑起来

```bash
cd 实验六
npm install          # 第一次
npm start            # 启动，默认 http://localhost:3000
```

打开 <http://localhost:3000/> 就是完整网站（后端同时托管了打包好的前端）。
打开 <http://localhost:3000/api/dishes> 能直接看到接口返回的 JSON。

> 改端口：`PORT=4000 npm start`（Windows 用 `set PORT=4000 && npm start`）

### 前端怎么连

`client/utils/config.js` 里只有一个常量：

```js
export const BASE_URL = 'http://localhost:3000'
```

| 运行场景 | 要改成什么 |
| --- | --- |
| 浏览器（HBuilderX 运行到 Chrome） | 不用改 |
| 手机 App / 微信小程序 | 电脑的局域网 IP，如 `http://192.168.1.8:3000`（`ipconfig` 查） |
| 部署到服务器 | `https://你的域名` |

真机调试还要注意：微信开发者工具里勾上「不校验合法域名」（`manifest.json` 已设 `urlCheck: false`），
手机和电脑要在同一个 Wi-Fi 下。

---

## 二、接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| GET | `/api/stats` | 首页统计：菜品数、食堂数、平均分、评论数 |
| GET | `/api/dishes` | 菜品列表，支持 `?keyword=&category=&sort=` |
| GET | `/api/dishes/:id` | 单道菜（含评论） |
| GET | `/api/dishes/:id/comments` | 某道菜的评论 |
| POST | `/api/dishes/:id/comments` | 发评论，body：`{name, rating, content}` |
| GET | `/api/favorites` | 本设备收藏的 id 列表 |
| PUT | `/api/favorites/:id` | 加收藏 |
| DELETE | `/api/favorites/:id` | 取消收藏 |

`sort` 取值：`default` / `rating` / `priceAsc` / `priceDesc`。

**设备区分**：没有登录，客户端首次启动生成一个 `dev-xxxxxxxx` 存在本地，
之后每次请求带 `x-device-id` 头，后端按这个存收藏。

错误统一返回：

```json
{ "error": { "code": "DISH_NOT_FOUND", "message": "没有 id 为 999 的菜品" } }
```

---

## 三、目录结构

```
实验六/
├── package.json
├── server/
│   ├── app.js              # 入口：中间件、路由挂载、静态托管、错误处理
│   ├── store.js            # JSON 文件存储（原子写）
│   ├── seed.json           # 种子数据，首次启动时灌进 db.json
│   └── routes/
│       ├── dishes.js       # 菜品与评论
│       └── favorites.js    # 收藏
├── data/
│   └── db.json             # 运行时生成，删掉会重新用 seed 初始化
├── public/                 # 打包好的前端（uni-app H5 产物）
└── client/                 # uni-app 源码（实验四的副本 + 接口改造）
```

---

## 四、和实验四相比改了什么

| 位置 | 实验四 | 实验六 |
| --- | --- | --- |
| 数据来源 | `utils/dishes.js` 静态数组 | `GET /api/dishes` |
| 收藏 | `uni.setStorageSync` 存本机 | 服务器存，按设备号区分 |
| 评论 | 页面内的 `ref`，刷新就没 | `POST /api/comments` 落盘 |
| 筛选排序 | 前端 computed | 服务端 query 参数 |
| 统计 | 前端算 | `GET /api/stats` |
| 加载状态 | 无 | loading / error / 重试 |

新增/改写的文件：`client/utils/{config,api,useDishes}.js` 新增，
`client/utils/useFavorites.js` 改成服务端同步，三个页面改成异步加载。

---

## 五、验证过什么

- 接口：`curl` 逐条测过，包含 404、参数校验失败（id 非数字、评论太短、评分越界）
- 前端：首页 4 张推荐卡、菜单 12 张卡、搜索「牛」1 张、详情页、发评论全部正常，控制台零报错
- 持久化：发完评论重启服务，`GET /api/dishes/2` 仍能读到那条评论
- 兜底：`db.json` 被写坏时会自动备份并用种子数据重建
