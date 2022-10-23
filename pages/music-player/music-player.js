import _, {
  throttle
} from 'underscore'
import {
  playerListStore,
  AudioContext
} from '../../store/index'

const app = getApp()

Page({
  data: {
    //页面的逻辑
    currentIdx: 0,
    statusBarHeight: 0,
    taps: ["歌曲", "歌词"],
    innerHeight: 150,
    sliderValue: 0,
    isSliderChangIng: false,
    isWaitUpdate: false,
    showPopup: false,
    modeIcons: ["order", "random", "repeat"],


    //需要存放到Store的逻辑
    songInfo: {},
    lyricScrollTop: 0,
    isinitPlayer: false,
    currentTime: 0,
    isPlaying: true,
    lyriStrArr: [],
    currentLyr: '',
    lyrIdx: -1,
    playerSongs: [],
    playerIdx: -1,
    mode: 0, // 0: 列表循环 1: 随机播放 2: 单曲循环
  },

  onLoad(options) {
    const {
      id
    } = options
    const {
      statusBarHeight,
      innerHeight
    } = app.globalData
    this.setData({
      statusBarHeight,
      innerHeight
    })

    //TODO
    const updatedCurrentTimeThro = _.throttle(this.updateCurrentTime, 500, {
      leading: false,
      trailing: false
    })

    // 监听数据的改变
    playerListStore.onStates(["playerSongs", "playerIdx", "songInfo", "isinitPlayer", "currentTime", "isPlaying", "lyriStrArr", "currentLyr", "lyricScrollTop", "mode", "lyrIdx"], ({
      playerSongs,
      playerIdx,
      songInfo,
      isinitPlayer,
      currentTime,
      isPlaying,
      lyriStrArr,
      currentLyr,
      lyricScrollTop,
      mode,
      lyrIdx
    }) => {
      if (playerSongs) {
        this.setData({
          playerSongs
        })
      }
      if (playerIdx !== undefined) {
        this.setData({
          playerIdx
        })
      }
      if (songInfo) {
        this.setData({
          songInfo
        })
      }
      if (isinitPlayer !== undefined) {
        this.setData({
          isinitPlayer
        })
      }
      if (currentTime !== undefined) {
        if(!this.data.isSliderChangIng) {
          updatedCurrentTimeThro()
        }
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }
      if (lyriStrArr) {
        this.setData({
          lyriStrArr
        })
      }
      if (lyrIdx !== undefined) {
        this.setData({
          lyrIdx
        })
      }
      if (currentLyr) {
        this.setData({
          currentLyr
        })
      }
      if (lyricScrollTop !== undefined) {
        this.setData({
          lyricScrollTop
        })
      }
      if (playerIdx) {
        this.setData({
          playerIdx
        })
      }
      if (mode !== undefined) {
        this.setData({
          mode
        })
      }
    })

    playerListStore.dispatch('setUpMusicPlayer', id)
  },

  handleTap(e) {
    const {
      index
    } = e.currentTarget.dataset
    this.setData({
      currentIdx: index
    })
  },

  onSwiperChange(e) {
    const {
      current
    } = e.detail
    this.setData({
      currentIdx: current
    })
  },

  updateCurrentTime() {
    const currentTime = AudioContext.currentTime * 1000
    const sliderValue = (AudioContext.currentTime * 1000 / this.data.songInfo.dt) * 100
    this.setData({
      currentTime,
      sliderValue
    })
  },

  onSliderChange(e) {
    const {isPlaying} = this.data
    this.data.isWaitUpdate = true

    setTimeout(() => {
      this.data.isWaitUpdate = false
    }, 1500);

    const {
      dt
    } = this.data.songInfo
    const {
      value
    } = e.detail
    const currentTime = value / 100 * dt

    //seek 传入秒
    AudioContext.seek(currentTime / 1000);
    if (!isPlaying) {
      this.setData({isPlaying: true})
    }

    //重新定义是否在拖动
    this.setData({
      isSliderChangIng: false,
      currentTime,
      sliderValue: value
    })
  },

  onSliderChanging: throttle(function (e) {
    this.data.isSliderChangIng = true
    const {
      dt
    } = this.data.songInfo
    const {
      value
    } = e.detail
    const currentTime = value / 100 * dt


    this.setData({
      currentTime
    })
  }, 100),

  // 一些按钮的事件
  pauseOrPlaytap() {
    if (AudioContext.paused) {
      AudioContext.play()
      this.setData({
        isPlaying: true,
        isSliderChangIng: false
      })
    } else {
      AudioContext.pause()
      this.setData({
        isPlaying: false
      })
    }
  },

  btnHandlePrevTap() {
    this.handlePrevOrNext(false)
  },

  btnHandleNextTap() {
    this.handlePrevOrNext()
  },

  handlePrevOrNext(isNext = true) {
    let {
      playerIdx,
      playerSongs,
      mode
    } = this.data
    const playerIen = playerSongs.length

    switch (mode) {
      case 0:
        isNext ? playerIdx++ : playerIdx--
        if (playerIdx === -1) playerIdx = playerIen - 1
        if (playerIdx === playerIen) playerIdx = 0
        break;
      case 1:
        playerIdx = Math.floor(Math.random() * playerSongs.length)
        //如果随机重复则一直随机
        while (playerIdx === this.data.playerIdx) {
          playerIdx = Math.floor(Math.random() * playerSongs.length)
        }
        break;
      case 2:
        break;
    }

    this.setUpMusicPlayer(playerSongs[playerIdx].id)
    this.setData({
      playerIdx
    })
  },

  changeModeTap() {
    let {
      mode,
      modeIcons
    } = this.data
    mode++
    if (mode === modeIcons.length) mode = 0

    this.setData({
      mode
    })
  },

  showSongsTap() {
    this.setData({
      showPopup: true
    })
  },

  onClose() {
    this.setData({
      showPopup: false
    })
  },

  handlePopupItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      playerSongs
    } = this.data

    this.setData({
      playerIdx: index
    })
    this.setUpMusicPlayer(playerSongs[index].id)
    this.onClose()
  },
})