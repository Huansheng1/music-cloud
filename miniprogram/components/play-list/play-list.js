// components/play-list/play-list.js
Component({
  properties: {
    "songData": Object
  },
  observers: {
    ['songData.playCount'](number) {
      var number = number
      var numberInteger = String.prototype.split.call(number, '.')[0] // 取出小数点左边的数值
      if(numberInteger.length < 4) {
        this.setData({
          _playCount: number.toFixed(2)
        })
      }else if (numberInteger.length < 8) {
        number = number  / 10000
        this.setData({
          _playCount: number.toFixed(2) + '万'
        })
      } else {
        number = number / 100000000
        this.setData({
          _playCount: number.toFixed(2) + '亿'
        })
      }
    }
  },
  data: {
    _playCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    enterMusicList(options){
      // this.data.songData.id 与 this.properties.songData.id 都可以
      // 跳转到哪个页面，只能用相对路径；通过?key=value，对应的页面就能接收到传递过去的数据
      wx.navigateTo({
        url: `./../../pages/music-list/music-list?musicId=${this.data.songData.id}`,
      })
    }
  }
})