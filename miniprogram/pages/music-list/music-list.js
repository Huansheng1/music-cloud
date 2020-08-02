// pages/music-list/music-list.js
Page({
  data: {
    musicListData: [],
    musicList: [],
    headerInfoObj: {},
    bgImgCss: '',
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 接收到的数据：{musicId: "5017583325"}
    // console.log(options.musicId)
    const resultData = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicList',
        musicId: options.musicId
      }
    })
    console.log(resultData)
    this.setData({
        musicListData: resultData.result.data,
        musicList: resultData.result.data.tracks,
        headerInfoObj:{
          coverImgUrl:resultData.result.data.coverImgUrl,
          description:resultData.result.data.description,
          name:resultData.result.data.name
        },
        bgImgCss: 'background: url(' + resultData.result.data.coverImgUrl + ') no-repeat top/cover'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickCurrentSong(options){
    // console.log(options)
    this.setData({
      currentIndex:options.currentTarget.dataset.click_index
    })
    console.log(this.data.currentIndex)
  }
})