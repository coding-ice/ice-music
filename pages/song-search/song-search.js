import {throttle} from 'underscore'
import {getHotTags,getKeywords,getSuggestKeywords} from '../../service/search'

Page({
  data: {
    value: '',
    tags: [],
    currentIdx: 0,
    songs: [],
    suggestList: []
  },

  onLoad(options) {
    this.getHotTagsAction()
  },

  onChange: throttle(function(e) {
    const {detail: value} = e
    this.setData({value});

    if(!value) return 
    this.getSuggestKeywords(value)
  }, 500),

  handleTagTap(e) {
    const {keywords,index} = e.currentTarget.dataset
    this.getKeywordsAction(keywords)
    this.setData({value: keywords, currentIdx: index})
  },

  // 发送网络请求
  async getHotTagsAction() {
    const res = await getHotTags()
    
    this.setData({tags: res.result.hots})
  },

  async getKeywordsAction(keywords) {
    this.setData({songs: []})
    const res = await getKeywords(keywords)

    this.setData({songs: res.result.songs})
  },

  async getSuggestKeywords(keywords) {
    const res = await getSuggestKeywords(keywords)
    this.setData({suggestList: res.result.allMatch})
  }
})