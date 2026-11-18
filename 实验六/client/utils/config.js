/**
 * 后端地址配置
 *
 * 三种运行场景，改这一个常量就行：
 *   1. HBuilderX 运行到浏览器 / 手机浏览器：localhost 能通，保持默认
 *   2. 运行到手机 App 或微信小程序：手机访问不到电脑的 localhost，
 *      要改成电脑的局域网 IP，比如 http://192.168.1.8:3000（用 ipconfig 查）
 *   3. 部署到服务器：改成 https://你的域名
 */
export const BASE_URL = 'http://localhost:3000'
