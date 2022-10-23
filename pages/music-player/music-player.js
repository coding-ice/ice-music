import _, { throttle } from 'underscore'
import {playerListStore} from '../../store/index'

import parseLyricString from '../../utils/parse-lyricString'
import { getSongDetail, getSongLyric } from '../../service/player'
const app = getApp()
// 创建音乐上下文
const AudioContext = wx.createInnerAudioContext()

Page({
  data: {
    currentIdx: 0,
    lyriStrArr: [],
    songInfo: {},
    statusBarHeight: 0,
    taps: ["歌曲","歌词"],
    innerHeight: 150,
    isinitPlayer: false,

    //关于slider
    currentTime: 0,
    sliderValue: 0,
    isSliderChangIng: false,
    isWaitUpdate: false,

    // 一些按钮的状态
    isPlaying: true,

    // 关于歌词
    currentLyr: '',
    lyrIdx: -1,
    lyricScrollTop: 0,

    //控制播放列表
    playerSongs: [],
    playerIdx: -1,
    mode: 0, // 0: 列表循环 1: 随机播放 2: 单曲循环
    modeIcons: ["order", "random", "repeat"],
    showPopup: false
  },

  onLoad(options) {
    const {id} = options
    const {statusBarHeight,innerHeight} = app.globalData
    this.setData({statusBarHeight,innerHeight})

    // 监听数据的改变
    playerListStore.onStates(["playerSongs","playerIdx"], ({playerSongs, playerIdx}) => {
      if (playerSongs) {
        this.setData({playerSongs})
      }
      if (playerIdx !== undefined) {
        this.setData({playerIdx})
      }
    })
    
    this.setUpMusicPlayer(id)
  },

  //初始化音乐播放器
  setUpMusicPlayer(id) {
    this.setData({currentTime: 0, sliderValue:0, songInfo: {}, isPlaying: true})
    this.getSongDetailAction(id)
    this.getSongLyricAction(id)

    //更新为节流函数
    const updatedCurrentTimeThro = _.throttle(this.updateCurrentTime, 500, {leading: false, trailing: false})
    AudioContext.stop()
    AudioContext.autoplay = true
    AudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

    if (!this.data.isinitPlayer) {
      this.data.isinitPlayer = true
      AudioContext.onTimeUpdate(() => {
        const {isSliderChangIng, isWaitUpdate, lyriStrArr} = this.data
  
        if (!isSliderChangIng && !isWaitUpdate) {
          updatedCurrentTimeThro()
        }
  
        //匹配对应的歌词
        let index = lyriStrArr.length - 1
        const currentTime = AudioContext.currentTime * 1000
        for (let i = 0; i < lyriStrArr.length; i++) {
          if (lyriStrArr[i].time > currentTime) {
            index = i - 1
            break;
          } 
        }
  
        if (index !== this.data.lyrIdx) {
          const currentLyr = lyriStrArr[index]
          if(!currentLyr) return
          this.setData({currentLyr:currentLyr.text,lyrIdx: index, lyricScrollTop: index * 40})
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


  handleTap(e) {
    const {index} = e.currentTarget.dataset
    this.setData({currentIdx: index})
  },

  onSwiperChange(e) {
    const {current} = e.detail
    this.setData({currentIdx: current})
  },
  
  updateCurrentTime() {      
    const currentTime = AudioContext.currentTime * 1000
    const sliderValue = (AudioContext.currentTime * 1000 / this.data.songInfo.dt) * 100
    this.setData({ currentTime, sliderValue })
  },

  onSliderChange(e) {
    this.data.isWaitUpdate = true

    setTimeout(() => {
      this.data.isWaitUpdate = false
    }, 1500);

    const {dt} = this.data.songInfo
    const {value} = e.detail 
    const currentTime = value / 100 * dt

    //seek 传入秒
    AudioContext.seek(currentTime / 1000)
    
    //重新定义是否在拖动
    this.setData({isSliderChangIng:false, currentTime, sliderValue:value})
  },

  onSliderChanging: throttle(function(e) {
    this.data.isSliderChangIng = true
    const {dt} = this.data.songInfo
    const {value} = e.detail
    const currentTime = value / 100 * dt

    
    this.setData({currentTime})
  }, 100),

  // 一些按钮的事件
  pauseOrPlaytap() {
    if (AudioContext.paused) {
      AudioContext.play()
      this.setData({isPlaying: true})
    } else {
      AudioContext.pause()
      this.setData({isPlaying: false})
    }
  },

  btnHandlePrevTap() {
    this.handlePrevOrNext(false)
  },

  btnHandleNextTap() {
    this.handlePrevOrNext()
  },

  handlePrevOrNext(isNext = true) {
    let {playerIdx, playerSongs, mode} = this.data
    const playerIen = playerSongs.length

    switch(mode) {
      case 0:
        isNext ? playerIdx++ : playerIdx--
        if(playerIdx === -1)  playerIdx = playerIen - 1
        if(playerIdx === playerIen) playerIdx = 0
        break;
      case 1:
        playerIdx = Math.floor(Math.random() * playerSongs.length)
        //如果随机重复则一直随机
        while(playerIdx === this.data.playerIdx) {
          playerIdx = Math.floor(Math.random() * playerSongs.length)
        }
        break;
      case 2:
        break;
    }

    this.setUpMusicPlayer(playerSongs[playerIdx].id)
    this.setData({playerIdx})
  },

  changeModeTap() {
    let {mode, modeIcons} = this.data
    mode++
    if(mode === modeIcons.length) mode = 0

    this.setData({mode})
  },

  showSongsTap() {
    this.setData({showPopup: true})
  },

  onClose(){
    this.setData({showPopup: false})
  },

  handlePopupItemTap(e) {
    const {index} = e.currentTarget.dataset
    const {playerSongs} = this.data

    this.setData({playerIdx: index})
    this.setUpMusicPlayer(playerSongs[index].id)
    this.onClose()
  },

  // 网络请求
  async getSongDetailAction(id) {
    const res = await getSongDetail(id)
    this.setData({songInfo: res.songs[0]})
  },

  async getSongLyricAction(id) {
    const res = await getSongLyric(id)
    if(!res) return

    const lyriStrArr = parseLyricString(res.lrc.lyric)
    this.setData({lyriStrArr})
  },
})