const MAX_NUM = 15
Page({
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playListData: []
  },
  onLoad: function (options) {
    this._getPlayList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉触发先清空我们本地歌单列表
    this.setData({
      data: {
        playListData: []
      }
    })
    // 重新获取
    this._getPlayList()
    // 数据获取成功，停止下拉刷新动画
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlayList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getPlayList() {
    // 加载显示
    wx.showLoading({
      title: '加载网络请求中',
    })
    // 云函数music调用获取数据
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: "playList",// 要调用的路由的路径，传入准确路径或者通配符*
        skipCount: this.data.playListData.length,
        limitCount: MAX_NUM
      }
    }).then(v => {
      // 将请求到的数据赋值给data里的playListData
      this.setData({
        playListData: [...this.data.playListData, ...v.result.data.data]
      })
      // 将 加载组件 隐藏
      wx.hideLoading({})
      console.log(v.result.data)
      if (!v.result.data.data.length) {
        wx.showToast({
          title: '没歌单推荐啦',
        })
      } else {
        wx.showToast({
          title: '请求成功！',
        })
      }
    })
  }
})