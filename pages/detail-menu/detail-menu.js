import {getAllTag,getSongList} from '../../service/music'

Page({
  data: {
    menuList: []
  },

  async onLoad() {
    const promises = []

    getAllTag().then(res => {
      for (let tag of res.tags) {
        const promise = getSongList(tag.name, 6)
        promises.push(promise)
      }
      
      Promise.all(promises).then(res => {
        this.setData({menuList: res})
      })
    })
  },

})