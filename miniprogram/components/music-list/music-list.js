// components/music-list.js
Component({
  properties: {
    songInfo: Object,
    songListNumber: Number,
    currentIndex: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    bdText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  observers: {
    songInfo() {
      const info = this.data.songInfo
      if (info.ar) {
        if (info.ar.length) {
          this.setData({
            bdText: info.ar[0].name + '——' + info.al.name
          })
        } else {
          this.setData({
            bdText: info.al.name
          })
        }
      }
    }
  }
})