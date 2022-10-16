import {getTopMv} from '../../service/video.js'

Page({
  data: {
    topMvList: [],
    limit: 20,
    offset: 0,
    hasMore: true
  },
  onLoad() {
    const {limit, offset} = this.data
    this.getTopMvAction(limit, offset)
  },

  async onPullDownRefresh() {
    this.data.hasMore = true
    this.data.offset = 0
    this.data.topMvList = []

    const {limit, offset} = this.data

    await this.getTopMvAction(limit, offset)
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    const {hasMore, limit, offset} = this.data

    if(hasMore) {
      this.getTopMvAction(limit, offset)
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