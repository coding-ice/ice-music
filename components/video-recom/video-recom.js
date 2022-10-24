// components/video-recom/video-recom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoItem: {
      type: Object,
      value: {}
    },
    isBig: {
      type: Boolean,
      value: false
    },
    isArrow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      const {id} = this.data.videoItem
      if(!id) return
      
      wx.navigateTo({
        url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
      })
    }
  }
})
