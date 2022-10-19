Component({
  properties: {
    peakRankMap: {
      type: Object,
      value: {}
    }
  },
  methods:{
    handlePeak(e) {
      const {type} = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/song-list/song-list?type=${type}`,
      })
    }
  }
})