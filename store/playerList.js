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
    //初始化State
    initState(ctx) {
      ctx.currentTime = 0
      ctx.songInfo = {}
      ctx.isPlaying = true
      ctx.lyriStrArr = []
      ctx.currentLyr = ''
      ctx.lyrIdx = -1
      ctx.lyricScrollTop = 0
    },
    //初始化音乐播放器
    setUpMusicPlayer(ctx, id, playerIdx = -1) {
      //1. 初始化数据
      this.dispatch('initState')
      //2. 发送网络请求
      this.dispatch("getSongDetailAction", id)
      this.dispatch("getSongLyricAction", id)

      if(playerIdx !== -1) {
        ctx.playerIdx = playerIdx
      }
      
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
            if (!currentLyr.text.trim()) return

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
          this.dispatch('handlePrevOrNext')
        })
      }

    },

    //其他按钮的逻辑
    handlePrevOrNext(ctx, isNext = true) {
      this.dispatch('initState')
      let {
        playerIdx,
        playerSongs,
        mode
      } = ctx

      const playerIen = playerSongs.length
      switch (mode) {
        case 0:
          isNext ? playerIdx++ : playerIdx--
          if (playerIdx === -1) playerIdx = playerIen - 1
          if (playerIdx === playerIen) playerIdx = 0
          break;
        case 1:
          playerIdx = Math.floor(Math.random() * playerIen)
          //如果随机重复则一直随机
          while (playerIdx === ctx.playerIdx) {
            playerIdx = Math.floor(Math.random() * playerIen)
          }
          break;
        case 2:
          break;
      }
      this.dispatch("setUpMusicPlayer", playerSongs[playerIdx].id)
      ctx.playerIdx = playerIdx
    },

    //改变播放模式
    changeModeTap(ctx) {
      let {
        mode,
        modeIcons
      } = ctx
      mode++
      if (mode === modeIcons.length) mode = 0
  
      ctx.mode = mode
    },

    pauseOrPlaytap(ctx) {
      if (AudioContext.paused) {
        AudioContext.play()
        ctx.isPlaying = true
      } else {
        AudioContext.pause()
        ctx.isPlaying = false
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