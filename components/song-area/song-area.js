// components/song-area/song-area.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    songList: {
      type: Array,
      value: []
    }
  },

  methods:{
    onHandleClick() {
      wx.navigateTo({
        url: '/pages/detail-menu/detail-menu',
      })
    }
  }
})
