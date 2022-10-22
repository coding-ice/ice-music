import {throttle} from 'underscore'
import {getHotTags,getKeywords,getSuggestKeywords} from '../../service/search'

Page({
  data: {
    value: '',
    tags: [],
    currentIdx: 0,
    songs: [],
    suggestList: [],
    type: 'hot',
  },

  onLoad(options) {
    this.getHotTagsAction()
  },

  onChange: throttle(function(e) {
    const {detail: value} = e
    this.setData({value,suggestList: []});

    if (!value) {
      this.setData({type: 'hot', songs: []});
      return
    } else {
      this.setData({type: 'suggest'});
    }

    this.getSuggestKeywords(value)
  }, 500),

  onClear() {
    this.setData({type: 'hot', songs: []})
  },

  handleTagTap(e) {
    this.setData({type: 'keywords'})
    const {keywords,index} = e.currentTarget.dataset
    this.getKeywordsAction(keywords)
    this.setData({value: keywords, currentIdx: index})
  },

  searchItemTap(e) {
    const {item:{keyword}} = e.currentTarget.dataset

    //根据关键字 获取songs的列
    this.getKeywordsAction(keyword)
    this.setData({type: 'keywords'})
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