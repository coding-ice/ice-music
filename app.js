App({
  globalData: {
    statusBarHeight: 0,
    innerHeight: 0
  },

  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        const {screenHeight, statusBarHeight} = res
        this.globalData = {
          statusBarHeight: statusBarHeight,
          innerHeight: screenHeight - statusBarHeight - 44
        }
      },
    })
  }
})