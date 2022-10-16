import {getMvVideo, getMvInfo, getMvRelatedVideo} from '../../service/video'
Page({
  data:{
    mvUrl: '',
    mvInfo: {},
    mvRelatedVideoList: []
  },
  onLoad(params) {
    const {id} = params
    
    this.getMvVideoAction(id)
    this.getMvInfoAction(id)
    this.getMvRelatedVideoAction(id)
  },

  async getMvVideoAction(id) {
    const res = await getMvVideo(id)
    this.setData({mvUrl: res.data.url})
  },

  async getMvInfoAction(mvid) {
    const res = await getMvInfo(mvid)
    this.setData({ mvInfo: res.data })
  },

  async getMvRelatedVideoAction(id) {
    const res = await getMvRelatedVideo(id)
    this.setData({mvRelatedVideoList: res.data})
  }

})