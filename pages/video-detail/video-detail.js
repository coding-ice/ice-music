import {getMvVideo} from '../../service/video'
Page({
  data:{
    mvUrl: ''
  },
  onLoad(params) {
    const {id} = params
    this.getMvVideoAction(id)
  },

  async getMvVideoAction(id) {
    const res = await getMvVideo(id)
    this.setData({mvUrl: res.data.url})
  }
})