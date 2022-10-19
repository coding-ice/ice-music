import {recomSongStore, peakRankStore} from '../../store/index'
import {getSongRankList} from '../../service/music'

Page({
  data: {
    isSongMenu: false,
    songs: [],
    title: '',
    currentKey: '',
    rankListMap: {
      "newSongsRank": "新歌榜",
      "originSongsRank": "原创榜",
      "updatedSonsRank": "飙升榜",
    }
  },

  onLoad(options) {
    let {type:title, id} = options

    if (id) {
      // song menu
      this.getSongRankListAction(id)
      this.setData({ isSongMenu: true })
    }else {
      // peak rank
      this.onChangeSongsData(title)
      if (title === 'recomSongList') {
        title = '推荐歌曲'
      }
      this.setData({title})
      wx.setNavigationBarTitle({
        title
      })
    }
    
  },

  onUnload() {
    const {currentKey} = this.data
    if (!currentKey) return
    if (currentKey === 'recomSongList') {
      recomSongStore.offState(currentKey, this.setSongsData)
    }else {
      peakRankStore.offState(currentKey, this.setSongsData)
    }
  },

  onChangeSongsData(type) {
    const map = this.data.rankListMap

    // 推荐歌曲
    if (type === 'recomSongList') {
      this.data.currentKey = type
      recomSongStore.onState(type, this.setSongsData)
      return 
    }
    
    // 巅峰榜
    for (const key in map) {
      if (map[key] === type) {
        this.data.currentKey = key
        peakRankStore.onState(key, this.setSongsData)
        break;
      }
    }
  },
  
  setSongsData(val) {
    this.setData({songs: val})
  },

  async getSongRankListAction(id) {
    const res = await getSongRankList(id)
    this.setData({songs: res.playlist})
  }
})