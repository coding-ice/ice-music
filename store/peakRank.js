import {HYEventStore} from 'hy-event-store'
import {getSongRankList} from '../service/music'

export const peakRankStore = new HYEventStore({
  state: {
    newSongsRank: [],
    originSongsRank: [],
    updatedSonsRank: []
  },
  actions: {
    getSongRankListAction(ctx) {
      const peakRankMap = {
        newSongsRank: 3779629,
        originSongsRank: 2884035,
        updatedSonsRank: 19723756,
      }
      for (const key in peakRankMap) {
        getSongRankList(peakRankMap[key]).then(res => {
          ctx[key] = res.playlist
        })
      }
    }
  }
})

