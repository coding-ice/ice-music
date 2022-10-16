import {getBannerList} from '../../service/music'

Page({
  data:{
    bannerList: []
  },

  onLoad() {
    this.getBannerListAction()
  },

  onSearchClick() {
    wx.navigateTo({
      url: '/pages/song-search/song-search',
    })
  },

  // 网络请求
  async getBannerListAction() {
    const res = await getBannerList()
    this.setData({bannerList: res.banners})
  }
})