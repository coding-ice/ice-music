import {getBannerList, getSongList} from '../../service/music'
import recomSongStore from '../../store/recomSong.js'

Page({
  data:{
    bannerList: [],
    songs:[],
    hotSongList: [],
    recomList: [],
  },

  onLoad() {
    this.getBannerListAction()
    this.getSongListAction()
    this.getRecomListAction()

    // 监听数据
    recomSongStore.onState("recomSongList", val => this.setData({songs: val.slice(0,6)}))
    recomSongStore.dispatch('getRecomSongListAction')
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