import {iceRequest} from './index'

function getHotTags() {
  return iceRequest.get({
    url: '/search/hot'
  })
}

function getKeywords(keywords) {
  return iceRequest.get({
    url: '/search',
    data: {
      keywords
    }
  })
}

function getSuggestKeywords(keywords) {
  return iceRequest.get({
    url: '/search/suggest',
    data: {
      keywords,
      type: 'mobile'
    }
  })
}

export {
  getHotTags,
  getKeywords,
  getSuggestKeywords
}