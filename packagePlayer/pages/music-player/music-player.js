import _, {
  throttle
} from 'underscore'
import {
  playerListStore,
  AudioContext
} from '../../../store/index'

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
    stateKeys: ["playerSongs", "playerIdx", "songInfo", "isinitPlayer", "currentTime", "isPlaying", "lyriStrArr", "currentLyr", "lyricScrollTop", "mode", "lyrIdx"],


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
    if (id) {
      playerListStore.dispatch('setUpMusicPlayer', id)
    }
    const {
      statusBarHeight,
      innerHeight
    } = app.globalData
    this.setData({
      statusBarHeight,
      innerHeight,
      // sliderValue: 0,
      songInfo: {}
    })

    // 监听数据的改变
    playerListStore.onStates(this.data.stateKeys, this.watchPlayStore)
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

  updatedCurrentTimeThro: throttle(function(currentTime) {
    const sliderValue = (currentTime / this.data.songInfo.dt) * 100
    this.setData({
      currentTime,
      sliderValue
    })
  }, 500, {trailing: false, leading: false}),

  onSliderChange(e) {
    const {
      isPlaying
    } = this.data
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
      this.setData({
        isPlaying: true
      })
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
    this.setData({ isSliderChangIng: false })
    playerListStore.dispatch('pauseOrPlaytap')
  },

  btnHandlePrevTap() {
    this.setData({
      sliderValue: 0
    })
    playerListStore.dispatch('handlePrevOrNext', false)
  },

  btnHandleNextTap() {
    this.setData({
      sliderValue: 0
    })
    playerListStore.dispatch('handlePrevOrNext', true)
  },

  changeModeTap() {
    playerListStore.dispatch('changeModeTap')
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
      playerIdx: index,
      sliderValue: 0
    })

    playerListStore.dispatch('setUpMusicPlayer', playerSongs[index].id, index)
    this.onClose()
  },

  watchPlayStore({
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
  }) {
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
      if (!this.data.isSliderChangIng) {
        this.setData({
          currentTime
        })
        this.updatedCurrentTimeThro(currentTime)
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
    if (currentLyr !== undefined) {
      this.setData({
        currentLyr
      })
    }
    if (lyricScrollTop !== undefined) {
      this.setData({
        lyricScrollTop
      })
    }
    if (playerIdx !== undefined) {
      this.setData({
        playerIdx
      })
    }
    if (mode !== undefined) {
      this.setData({
        mode
      })
    }
  },

  onUnload() {
    const {stateKeys} = this.data
    playerListStore.offStates(stateKeys, this.watchPlayStore)
  }
})