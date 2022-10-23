import {
  HYEventStore
} from 'hy-event-store'
import parseLyricString from '../utils/parse-lyricString'
import {
  getSongDetail,
  getSongLyric
} from '../service/player'

export const AudioContext = wx.createInnerAudioContext()

export const playerListStore = new HYEventStore({
  state: {
    playerSongs: [],
    playerIdx: -1,
    songInfo: {},
    isinitPlayer: false,
    currentTime: 0,
    isPlaying: true,
    lyriStrArr: [],
    currentLyr: '',
    lyricScrollTop: 0,
    mode: 0, // 0: 列表循环 1: 随机播放 2: 单曲循环
    modeIcons: ["order", "random", "repeat"],
    lyrIdx: -1
  },

  actions: {
    //初始化音乐播放器
    setUpMusicPlayer(ctx, id) {
      //1. 初始化state
      ctx.currentTime = 0
      ctx.songInfo = {}
      ctx.isPlaying = true
      ctx.lyriStrArr = []
      ctx.currentLyr = ''

      //2. 发送网络请求
      this.dispatch("getSongDetailAction", id)
      this.dispatch("getSongLyricAction", id)

      AudioContext.stop()
      AudioContext.autoplay = true
      AudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

      if (!ctx.isinitPlayer) {
        ctx.isinitPlayer = true
        AudioContext.onTimeUpdate(() => {
          const {
            lyriStrArr
          } = ctx

          //匹配对应的歌词
          let index = lyriStrArr.length - 1
          const currentTime = AudioContext.currentTime * 1000
          ctx.currentTime = currentTime
          for (let i = 0; i < lyriStrArr.length; i++) {
            if (lyriStrArr[i].time > currentTime) {
              index = i - 1
              break;
            }
          }

          if (index !== ctx.lyrIdx) {
            const currentLyr = lyriStrArr[index]
            if (!currentLyr) return

            ctx.currentLyr = currentLyr.text,
              ctx.lyrIdx = index,
              ctx.lyricScrollTop = index * 40
          }
        })

        AudioContext.onWaiting(() => {
          AudioContext.pause()
        })

        AudioContext.onCanplay(() => {
          AudioContext.play()
        })

        AudioContext.onEnded(() => {
          this.handlePrevOrNext()
        })
      }

    },

    // 网络请求
    async getSongDetailAction(ctx, id) {
      const res = await getSongDetail(id)

      ctx.songInfo = res.songs[0]
    },

    async getSongLyricAction(ctx, id) {
      const res = await getSongLyric(id)
      if (!res) return

      const lyriStrArr = parseLyricString(res.lrc.lyric)
      ctx.lyriStrArr = lyriStrArr
    },
  }
})