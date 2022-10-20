Component({
  options: {
    multipleSlots: true
  },
  properties: {
    center: {
      type: String,
      value: "默认值"
    }
  },
  data: {
  },

  methods: {
    backTap() {
      wx.navigateBack()
    }
  }
})