import {HYEventStore} from 'hy-event-store'
import {getSongRankList} from '../service/music.js'

export const recomSongStore = new HYEventStore({
  state: {
    recomSongList: {}
  },
  actions: {
    async getSongRankListAction(ctx) {
      const res = await getSongRankList()
      ctx.recomSongList = res.playlist
    }
  }
})

