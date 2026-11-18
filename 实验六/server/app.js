/**
 * 食光 · Express 后端入口
 *
 * 启动：npm start      （默认 http://localhost:3000）
 * 改端口：PORT=4000 npm start
 *
 * 干三件事：
 *   1. 提供 /api/* 的 JSON 接口（菜品、评论、收藏、统计）
 *   2. 托管 public/ 里打包好的前端（uni-app 的 H5 产物）
 *   3. 统一处理 404 和异常，保证任何情况下都返回 JSON，不吐 HTML 堆栈
 */
const path = require('node:path')
const express = require('express')
const cors = require('cors')

const store = require('./store')
const dishesRouter = require('./routes/dishes')
const favoritesRouter = require('./routes/favorites')

const app = express()
const PORT = Number(process.env.PORT) || 3000

// 接口返回带缩进，用浏览器直接打开 /api/dishes 也能看清结构
app.set('json spaces', 2)

// ---------- 中间件 ----------

// 跨域：HBuilderX 运行到浏览器时端口不是 3000，必须放开
app.use(cors())

// 解析 JSON 请求体，限制 64KB，防止有人塞超大内容进来
app.use(express.json({ limit: '64kb' }))

// 请求日志：方法、路径、状态码、耗时
app.use((req, res, next) => {
  const startedAt = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - startedAt
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`)
  })
  next()
})

// ---------- 接口 ----------

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'shiguang-server', time: new Date().toISOString() })
})

app.use('/api/dishes', dishesRouter)
app.use('/api/favorites', favoritesRouter)

// 首页统计：数字全部现算，不写死
app.get('/api/stats', (req, res) => {
  const dishes = store.dishes()
  const canteens = new Set(dishes.map((dish) => dish.canteen.split(' · ')[0]))
  const average = dishes.reduce((sum, dish) => sum + dish.rating, 0) / dishes.length

  res.json({
    dishes: dishes.length,
    canteens: canteens.size,
    averageRating: Number(average.toFixed(1)),
    comments: dishes.reduce((sum, dish) => sum + dish.comments.length, 0)
  })
})

// ---------- 静态资源与前端 ----------

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

app.use(express.static(PUBLIC_DIR))

// 单页应用兜底：不是 /api 开头的 GET 一律返回 index.html，
// 这样前端路由（#/pages/...）刷新也不会 404
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next()
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (error) => {
    if (error) next()
  })
})

// ---------- 兜底处理 ----------

// 到这里说明既不是接口，也没有对应的静态文件
app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `找不到 ${req.method} ${req.originalUrl}` } })
})

// 统一错误处理：body 解析失败、代码抛异常都走这里
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'BAD_JSON', message: '请求体不是合法的 JSON' } })
  }

  console.error('[error]', error)
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器开小差了，稍后再试' } })
})

// ---------- 启动 ----------

store.load()

app.listen(PORT, () => {
  console.log('')
  console.log('  食光 · 后端已启动')
  console.log(`  接口地址  http://localhost:${PORT}/api/dishes`)
  console.log(`  前端页面  http://localhost:${PORT}/`)
  console.log('')
})
