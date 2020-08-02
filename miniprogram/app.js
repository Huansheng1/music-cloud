//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id', // 如果我们创建了两个环境需要指定某个环境，则将该配置打开并设置对应环境ID
        traceUser: true,// 是否记录使用我们小程序的用户，结果以倒序排列
      })
    }

    this.globalData = {}
  }
})
