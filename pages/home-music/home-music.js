import {
  getBannerList,
  getSongList
} from '../../service/music'
import {
  recomSongStore,
  peakRankStore,
  playerListStore
} from '../../store/index'

Page({
  data: {
    bannerList: [],
    songs: [],
    hotSongList: [],
    recomList: [],

    //巅峰榜
    peakRankMap: {},

    //播放详情的Store
    songInfo: {},
    currentLyr: '',
    isPlaying: ''
  },

  onLoad() {
    this.getBannerListAction()
    this.getSongListAction()
    this.getRecomListAction()

    //监听playerList的数据
    playerListStore.onStates(['songInfo', 'currentLyr', 'isPlaying'], ({
      songInfo,
      currentLyr,
      isPlaying
    }) => {
      if (songInfo) this.setData({songInfo})
      if (currentLyr) this.setData({currentLyr})
      if (isPlaying !== undefined) this.setData({isPlaying})
    })

    // 推荐歌曲 监听数据及派发
    recomSongStore.onState("recomSongList", val => {
      if (!(Object.keys(val).length)) return
      this.setData({
        songs: val.tracks.slice(0, 6)
      })
    })
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
      let newPeakRankMap = {
        ...this.data.peakRankMap,
        [key]: val
      }
      this.setData({
        peakRankMap: newPeakRankMap
      })
    })
  },

  onSearchClick() {
    wx.navigateTo({
      url: '/pages/song-search/song-search',
    })
  },

  onRecomHandleClick() {
    wx.navigateTo({
      url: '/pages/song-list/song-list?type=recomSongList',
    })
  },

  playerListTap(e) {
    const {
      songs
    } = this.data
    const {
      index
    } = e.currentTarget.dataset

    playerListStore.setState("playerSongs", songs)
    playerListStore.setState("playerIdx", index)
  },
  pauseOrPlaytap(e) {
    playerListStore.dispatch('pauseOrPlaytap')
  },
  playBarTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  },

  // 1. 获取轮播图数据
  async getBannerListAction() {
    const res = await getBannerList()
    this.setData({
      bannerList: res.banners
    })
  },

  //2. 获取热门歌单数据
  async getSongListAction() {
    const res = await getSongList("全部", 6)
    this.setData({
      hotSongList: res.playlists
    })
  },
  //3. 获取推荐歌单数据
  async getRecomListAction() {
    const res = await getSongList("华语", 6)
    this.setData({
      recomList: res.playlists
    })
  }
})