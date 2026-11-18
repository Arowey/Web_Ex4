/**
 * 数据存储：一个 JSON 文件当数据库
 *
 * 课程作业不需要真的装 MySQL，用 data/db.json 存全部数据足够了：
 * 结构简单、能直接打开看、换机器拷一个文件就走。
 *
 * 两个关键点：
 *   - 启动时如果 db.json 不存在，就用 server/seed.json 初始化；
 *   - 每次写盘都「先写临时文件再改名」，避免写到一半断电把数据写坏。
 */
const fs = require('node:fs')
const path = require('node:path')

const DATA_DIR = path.join(__dirname, '..', 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const SEED_FILE = path.join(__dirname, 'seed.json')

/** 内存里的唯一数据副本 */
let db = null

/** 读种子数据（首次启动用） */
function readSeed() {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))
  return {
    categories: seed.categories,
    dishes: seed.dishes,
    // favorites 以设备号为键：{ "dev-xxxx": [1, 3] }
    favorites: {}
  }
}

/**
 * 读取数据库，第一次调用时从磁盘加载或初始化。
 * @returns {object} 整个数据库对象
 */
function load() {
  if (db !== null) return db

  fs.mkdirSync(DATA_DIR, { recursive: true })

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
    } catch (error) {
      // 文件被写坏时不让服务起不来：备份一份再从种子重建
      const backup = `${DB_FILE}.broken-${Date.now()}`
      fs.renameSync(DB_FILE, backup)
      console.warn(`[store] db.json 解析失败，已备份到 ${path.basename(backup)}，用种子数据重建`)
      db = readSeed()
      save()
    }
  } else {
    db = readSeed()
    save()
    console.log(`[store] 初始化数据库：${db.dishes.length} 道菜`)
  }

  return db
}

/** 把内存数据写回磁盘（原子写） */
function save() {
  const tmp = `${DB_FILE}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8')
  fs.renameSync(tmp, DB_FILE)
}

/** 拿全部菜品 */
function dishes() {
  return load().dishes
}

/** 按 id 找一道菜 */
function dish(id) {
  return load().dishes.find((item) => item.id === id) || null
}

/** 分类列表 */
function categories() {
  return load().categories
}

/** 某个设备收藏的菜品 id */
function favoritesOf(deviceId) {
  const all = load().favorites
  if (!Array.isArray(all[deviceId])) all[deviceId] = []
  return all[deviceId]
}

/** 加收藏，返回是否真的新增了 */
function addFavorite(deviceId, id) {
  const ids = favoritesOf(deviceId)
  if (ids.includes(id)) return false
  ids.push(id)
  save()
  return true
}

/** 取消收藏，返回是否真的删掉了 */
function removeFavorite(deviceId, id) {
  const ids = favoritesOf(deviceId)
  const index = ids.indexOf(id)
  if (index === -1) return false
  ids.splice(index, 1)
  save()
  return true
}

/** 给某道菜加一条评论，返回新评论 */
function addComment(dishId, comment) {
  const target = dish(dishId)
  if (target === null) return null

  const created = {
    id: `${dishId}-${Date.now().toString(36)}`,
    name: comment.name,
    rating: comment.rating,
    content: comment.content,
    time: '刚刚'
  }
  target.comments.unshift(created)
  // 注意：这里刻意不改菜品评分。
  // 真实项目会存 ratingSum / ratingCount 两个字段做加权平均，
  // 而本项目只有一个预先定好的 rating，用评论数去平均会让分数跳动得很怪。
  save()
  return created
}

module.exports = {
  load,
  save,
  dishes,
  dish,
  categories,
  favoritesOf,
  addFavorite,
  removeFavorite,
  addComment
}
