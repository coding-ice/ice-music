import {getBannerList, getSongList} from '../../service/music'
import {recomSongStore, peakRankStore} from '../../store/index'

Page({
  data:{
    bannerList: [],
    songs:[],
    hotSongList: [],
    recomList: [],

    //巅峰榜
    peakRankMap: {}
  },

  onLoad() {
    this.getBannerListAction()
    this.getSongListAction()
    this.getRecomListAction()

    // 推荐歌曲 监听数据及派发
    recomSongStore.onState("recomSongList", val => this.setData({songs: val.slice(0,6)}))
    recomSongStore.dispatch('getSongRankListAction')

    // 巅峰榜 监听数据及派发
    for (let peakKey in peakRankStore.state) {
      this.mapPeakStoreToData(peakKey)
    }

    peakRankStore.dispatch('getSongRankListAction')
  },

  // 设置巅峰榜Store到data中
  mapPeakStoreToData(key) {
    peakRankStore.onState(key, val => {
      let newPeakRankMap = {...this.data.peakRankMap, [key]: val}
      this.setData({peakRankMap: newPeakRankMap})
    })
  },

  onSearchClick() {
    wx.navigateTo({
      url: '/pages/song-search/song-search',
    })
  },

  onRecomHandleClick() {
    wx.navigateTo({
      url: '/pages/song-list/song-list',
    })
  },

  // 1. 获取轮播图数据
  async getBannerListAction() {
    const res = await getBannerList()
    this.setData({bannerList: res.banners})
  },
  
  //2. 获取热门歌单数据
  async getSongListAction() {
    const res = await getSongList("全部", 6)
    this.setData({hotSongList: res.playlists})
  },
  //3. 获取推荐歌单数据
  async getRecomListAction() {
    const res = await getSongList("华语", 6)
    this.setData({recomList: res.playlists})
  }
})