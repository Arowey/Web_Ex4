/**
 * 菜品相关接口
 *
 *   GET  /api/dishes                 列表，支持 ?keyword= &category= &sort=
 *   GET  /api/dishes/:id             单道菜
 *   GET  /api/dishes/:id/comments    评论列表
 *   POST /api/dishes/:id/comments    发一条评论
 */
const express = require('express')
const store = require('../store')

const router = express.Router()

/** 排序方式：客户端传字符串，服务端只认这三种 */
const SORTS = {
  rating: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price
}

/**
 * 把路径里的 id 解析成正整数。
 * @param {string} raw 原始字符串
 * @returns {number|null} 合法时返回数字，否则 null
 */
function parseId(raw) {
  const value = Number(raw)
  return Number.isInteger(value) && value > 0 ? value : null
}

/** 统一的参数错误 */
function badRequest(res, message) {
  return res.status(400).json({ error: { code: 'BAD_REQUEST', message } })
}

// 列表：筛选 + 排序都在服务端做，客户端只负责把条件拼进 query
router.get('/', (req, res) => {
  const keyword = String(req.query.keyword || '').trim()
  const category = String(req.query.category || '全部')
  const sort = String(req.query.sort || 'default')

  let list = store.dishes()

  if (category !== '全部') {
    list = list.filter((dish) => dish.category === category)
  }

  if (keyword !== '') {
    const word = keyword.toLowerCase()
    list = list.filter(
      (dish) =>
        dish.name.toLowerCase().includes(word) ||
        dish.desc.toLowerCase().includes(word) ||
        dish.canteen.toLowerCase().includes(word) ||
        dish.tags.some((tag) => tag.toLowerCase().includes(word))
    )
  }

  if (SORTS[sort]) {
    list = [...list].sort(SORTS[sort])
  }

  res.json({
    total: list.length,
    categories: store.categories(),
    items: list
  })
})

// 单道菜
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id)
  if (id === null) return badRequest(res, 'id 必须是正整数')

  const dish = store.dish(id)
  if (dish === null) {
    return res.status(404).json({ error: { code: 'DISH_NOT_FOUND', message: `没有 id 为 ${id} 的菜品` } })
  }

  res.json(dish)
})

// 评论列表
router.get('/:id/comments', (req, res) => {
  const id = parseId(req.params.id)
  if (id === null) return badRequest(res, 'id 必须是正整数')

  const dish = store.dish(id)
  if (dish === null) {
    return res.status(404).json({ error: { code: 'DISH_NOT_FOUND', message: `没有 id 为 ${id} 的菜品` } })
  }

  res.json({ dishId: id, total: dish.comments.length, items: dish.comments })
})

// 发评论
router.post('/:id/comments', (req, res) => {
  const id = parseId(req.params.id)
  if (id === null) return badRequest(res, 'id 必须是正整数')

  const body = req.body || {}
  const content = String(body.content || '').trim()
  const name = String(body.name || '').trim() || '匿名同学'
  const rating = Number(body.rating)

  if (content.length < 5) return badRequest(res, '评论内容至少 5 个字')
  if (content.length > 200) return badRequest(res, '评论内容不能超过 200 个字')
  if (name.length > 12) return badRequest(res, '昵称不能超过 12 个字')
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return badRequest(res, '评分必须是 1 到 5 的整数')
  }

  const created = store.addComment(id, { name, rating, content })
  if (created === null) {
    return res.status(404).json({ error: { code: 'DISH_NOT_FOUND', message: `没有 id 为 ${id} 的菜品` } })
  }

  res.status(201).json(created)
})

module.exports = router
