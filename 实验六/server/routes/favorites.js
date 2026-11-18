/**
 * 收藏相关接口
 *
 *   GET    /api/favorites      这台设备收藏了哪些
 *   PUT    /api/favorites/:id  加收藏
 *   DELETE /api/favorites/:id  取消收藏
 *
 * 没有做登录，用请求头 x-device-id 区分设备 —— 客户端首次启动生成一个随机串存在本地，
 * 之后每次请求带上。够用，也能讲清楚「为什么真实项目需要用户体系」。
 */
const express = require('express')
const store = require('../store')

const router = express.Router()

/**
 * 从请求头取设备号。
 * @param {import('express').Request} req 请求
 * @returns {string} 设备号，缺省时退化成 anonymous
 */
function deviceIdOf(req) {
  const raw = String(req.get('x-device-id') || '').trim()
  // 只允许字母数字和短横线，长度 6~64，防止把乱七八糟的东西写进 JSON 的键里
  return /^[A-Za-z0-9-]{6,64}$/.test(raw) ? raw : 'anonymous'
}

/** 解析路径里的菜品 id */
function parseId(raw) {
  const value = Number(raw)
  return Number.isInteger(value) && value > 0 ? value : null
}

// 我的收藏
router.get('/', (req, res) => {
  const deviceId = deviceIdOf(req)
  const ids = store.favoritesOf(deviceId)
  res.json({ deviceId, total: ids.length, ids })
})

// 加收藏
router.put('/:id', (req, res) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'id 必须是正整数' } })

  if (store.dish(id) === null) {
    return res.status(404).json({ error: { code: 'DISH_NOT_FOUND', message: `没有 id 为 ${id} 的菜品` } })
  }

  const deviceId = deviceIdOf(req)
  const added = store.addFavorite(deviceId, id)
  res.status(added ? 201 : 200).json({
    deviceId,
    dishId: id,
    added,
    ids: store.favoritesOf(deviceId)
  })
})

// 取消收藏
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'id 必须是正整数' } })

  const deviceId = deviceIdOf(req)
  const removed = store.removeFavorite(deviceId, id)
  res.json({ deviceId, dishId: id, removed, ids: store.favoritesOf(deviceId) })
})

module.exports = router
