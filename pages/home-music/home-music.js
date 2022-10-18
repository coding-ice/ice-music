import {getBannerList, getSongList} from '../../service/music'

Page({
  data:{
    bannerList: [],
    hotSongList: [],
    recomList: []
  },

  onLoad() {
    this.getBannerListAction()
    this.getSongListAction()
    this.getRecomListAction()
  },

  onSearchClick() {
    wx.navigateTo({
      url: '/pages/song-search/song-search',
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