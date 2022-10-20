import { getSongDetail, getSongLyric } from '../../service/player'
const app = getApp()
Page({
  data: {
    currentIdx: 0,
    lyricString: '',
    songInfo: {},
    statusBarHeight: 0,
    taps: ["歌曲","歌词"],
    innerHeight: 150,
  },

  onLoad(options) {
    const {id} = options
    const {statusBarHeight,innerHeight} = app.globalData
    this.setData({statusBarHeight,innerHeight})

    this.getSongDetailAction(id)
    this.getSongLyricAction(id)
  },

  async getSongDetailAction(id) {
    const res = await getSongDetail(id)
    this.setData({songInfo: res.songs[0]})
  },

  async getSongLyricAction(id) {
    const res = await getSongLyric(id)
    this.setData({lyricString: res.lrc.lyric})
  },

  handleTap(e) {
    const {index} = e.currentTarget.dataset

    this.setData({currentIdx: index})
  },
  onSwiperChange(e) {
    const {current} = e.detail

    this.setData({currentIdx: current})
  }
})