const axios = require('axios')
// 云函数入口文件
const cloud = require('wx-server-sdk')
// 云函数初始化
cloud.init()
// 数据库初始化
const db = cloud.database()
// 导入tcb-router
const TcbRouter = require('tcb-router')
// 配置axios的config参数
baseURL = 'http://musicapi.xiecheng.live'
const config = {
  baseURL: baseURL,
  timeout: 6000
}
// 创建axios实例
const http = axios.create(config)
// 云函数入口函数
exports.main = async (event, context) => {
  // 我们改为使用官方推荐的tcb-router管理；弃用上面的方案
  // 1. 创建tcb-router实例
  const app = new TcbRouter({
    event
  })
  // 3. app.use 全局中间件，适用于所有路由；可不写
  app.use(async (ctx, next) => {
    ctx.data = {} // 定义个data用于后续存储我们的主要数据；可不写
    await next() // 执行下个中间件；如果下面有中间件一定要写
  })
  // 该中间件只处理 playList 路由
  app.router('playList', async (ctx, next) => {
    // 既然路由指定就没必要传collection参数了
    // 上次我们忘记将返回数据排序了，指定createTime字段排序，排序顺序为时间逆序
    ctx.data = await db.collection('playList')
      .skip(Number(event.skipCount))
      .limit(Number(event.limitCount))
      .orderBy('createTime', 'desc')
      .get()
      .then(v => v)
    next()
  }, async (ctx) => {
    // 注意，最后中间件可以不用next，因为没有其他中间件了，直接返回数据
    // 其实，这个中间件也可以忽略，直接在上面通过ctx.body返回就行，我们只是演示可以写很多个中间件
    ctx.body = {
      code: 0,
      data: ctx.data
    } // ctx.body 中间件返回给调用者的数据
  })
  app.router('musicList', async (ctx) => {
    ctx.data = await http.get('/playlist/detail?id=' + event.musicId).then(v => {
      // console.log(v)
      // console.log(typeof v)
      return v.data.playlist
    })
    ctx.body = {
      code: 0,
      data: ctx.data
    }
  })
  // 2. 将服务返回，一和二 这两个一定要加上
  return app.serve()
}