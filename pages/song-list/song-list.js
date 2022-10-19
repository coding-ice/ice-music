import recomSongStore from '../../store/recomSong'

Page({
  data: {
    songs: []
  },
  onLoad() {
    recomSongStore.onState("recomSongList", this.changeRecomSongList)
  },

  onUnload() {
    recomSongStore.offState("recomSongList", this.changeRecomSongList)
  },

  changeRecomSongList(val) {
    this.setData({songs: val})
  }
})