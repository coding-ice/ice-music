import {getTopMv} from '../../service/video.js'

Page({
  data: {
    topMvList: [],
    limit: 20,
    offset: 0,
    hasMore: true
  },
  onLoad() {
    this.getTopMvAction(this.data.limit, this.data.offset)
  },

  async onPullDownRefresh() {
    this.data.hasMore = true
    this.data.offset = 0
    this.data.topMvList = []

    await this.getTopMvAction(this.data.limit, this.data.offset)
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    const {hasMore} = this.data

    if(hasMore) {
      this.getTopMvAction(this.data.limit, this.data.offset)
    }
  },

  //请求数据的Action
  async getTopMvAction(limit, offset) {
    const res = await getTopMv(limit, offset)
    const newTopMvList = [...this.data.topMvList, ...res.data]
    this.setData({topMvList: newTopMvList})
    this.data.offset = this.data.topMvList.length
    this.data.hasMore = res.hasMore
  }
})