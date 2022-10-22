import {HYEventStore} from 'hy-event-store'

export const playerListStore = new HYEventStore({
  state: {
    playerSongs: [],
    playerIdx: -1
  },
})