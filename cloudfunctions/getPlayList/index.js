// import axios from 'axios'
const axios = require('axios')
// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化云函数
cloud.init()
// 配置axios的config参数
baseURL = 'http://musicapi.xiecheng.live'
const config = {
  baseURL: baseURL,
  timeout: 6000
}
// 创建axios实例
const http = axios.create(config)
// 云数据库初始化
const db = cloud.database()
// 获得云数据库的集合playList
const playList = db.collection('playList')
// 定义个常量，其为云函数一次取数据最大数值
const MAX_NUM = 100
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取云数据库当前集合条数
  let countObj = await playList.count()
  let totalNum = countObj.total
  // 将云数据库数据除以限制数量，再向上取整获取 应向云数据库取多少次数据
  let batchTimes = Math.ceil(totalNum / MAX_NUM)
  // 循环取数据，避免云数据库数据大于100条导致获取的结果不完整
  const promiseArr = []
  for (let i = 0; i < batchTimes; i++) {
    // skip 跳过前 x 条数据，从 x+1 开始取；limit 限制一次性返回多少条数据
    promiseArr.push(playList.skip(i * MAX_NUM).limit(MAX_NUM).get())
  }
  // 上面为了避免阻塞，我们不await，直接将 promise对象 加入数组里
  let dataOld = []
  if (promiseArr.length > 0) {
    // 通过Promise.all 来确保结果是全部执行完毕的，通过使用await避免异步执行使结果还没获得时下面代码就被执行
    await Promise.all(promiseArr).then(v => {
      v.forEach(item => {
        dataOld = [...dataOld, ...item.data]
      })
    })
  }
  // // 获取云数据库本身的数据
  // let dataOld = await playList.get()
  // console.log(dataOld)
  // dataOld = dataOld.data
  // console.log(dataOld)
  http.get('/personalized')
    .then(v => {
      let resultData = typeof v.data === 'object' ? v.data : JSON.parse(v.data)
      resultData = resultData.result
      // console.log(resultData)
      let arrData = []
      if (dataOld.length > 0) {
        for (resultItem of resultData) {
          let hasData = false
          for (item of dataOld) {
            if (item.id === resultItem.id) {
              hasData = true
              break
            }
          }
          if (!hasData) arrData.push(resultItem)
        }
      } else {
        arrData = resultData
      }
      console.log('当前可插入的数据条数：' + arrData.length)
      // 遍历数组并插入到集合
      for (item of arrData) {
        // 集合插入数据
        playList.add({
          data: {
            ...item,
            createTime: db.serverDate() // 获取插入时数据库时间，方便排序
          }
        })
      }
    })
    .catch(e => {
      console.log('异常：')
      console.log(e)
    })
}