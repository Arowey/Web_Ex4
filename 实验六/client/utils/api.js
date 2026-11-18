/**
 * 接口请求封装
 *
 * 为什么不用 fetch：小程序端没有 fetch，uni.request 才是四端通用的。
 * 这一层做了三件事：
 *   1. 统一拼 BASE_URL 和 /api 前缀
 *   2. 自动带上设备号（后端用它区分「谁的收藏」）
 *   3. 把 HTTP 错误码和业务错误统一成 Promise 的 reject，页面只写 try/catch
 */
import { BASE_URL } from './config.js'

const DEVICE_KEY = 'shiguang-device-id'

/**
 * 取设备号，没有就生成一个存起来。
 * 真实项目这里是登录后的 userId，课程作业用随机串代替。
 * @returns {string} 形如 dev-k3f9a2x1
 */
function deviceId() {
  let id = ''
  try {
    id = uni.getStorageSync(DEVICE_KEY) || ''
  } catch (error) {
    id = ''
  }

  if (id === '') {
    id = `dev-${Math.random().toString(36).slice(2, 10)}`
    try {
      uni.setStorageSync(DEVICE_KEY, id)
    } catch (error) {
      // 存不了就算了，本次会话内还是能用的
    }
  }
  return id
}

/**
 * 发一个请求。
 *
 * @param {string} path 接口路径，不含 /api，比如 '/dishes/2'
 * @param {object} [options] { method, data }
 * @returns {Promise<any>} 解析后的响应体
 */
export function request(path, options = {}) {
  const method = options.method || 'GET'

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/api${path}`,
      method,
      // GET 的 data 会被 uni 自动拼成查询字符串
      data: options.data,
      timeout: 8000,
      header: {
        'x-device-id': deviceId(),
        'content-type': 'application/json'
      },
      success(response) {
        const body = response.data
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body)
          return
        }
        // 后端统一返回 { error: { code, message } }
        const message = (body && body.error && body.error.message) || `请求失败（${response.statusCode}）`
        reject(new Error(message))
      },
      fail() {
        reject(new Error('连不上服务器，确认后端已经启动（npm start）'))
      }
    })
  })
}

/** 常用的四个方法，页面里直接 api.get / api.post 更好读 */
export const api = {
  get: (path, data) => request(path, { method: 'GET', data }),
  post: (path, data) => request(path, { method: 'POST', data }),
  put: (path, data) => request(path, { method: 'PUT', data }),
  del: (path, data) => request(path, { method: 'DELETE', data })
}
