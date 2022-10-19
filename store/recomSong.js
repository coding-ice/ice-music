import {HYEventStore} from 'hy-event-store'
import {getRecomSongList} from '../service/music.js'

const recomSongStore = new HYEventStore({
  state: {
    recomSongList: []
  },
  actions: {
    async getRecomSongListAction(ctx) {
      const res = await getRecomSongList()
      ctx.recomSongList = res.playlist.tracks
    }
  }
})

export default recomSongStore