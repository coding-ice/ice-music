Component({
  properties: {
    songItem: {
      type: Object,
      value: {}
    }
  },
  methods: {
    handleClick() {
      const {id} = this.data.songItem
      wx.navigateTo({
        url: `/pages/song-list/song-list?id=${id}`,
      })
    }
  }
})
