// components/area-header/area-header.js
Component({
  properties: {
    title: {
      type: String,
      value: "默认值"
    },
    hasMore: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    moreHandleClick() {
      this.triggerEvent("handleClick")
    }
  }
})
