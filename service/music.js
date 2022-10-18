import {iceRequest} from './index'

function getBannerList() {
  return iceRequest.get({
    url: '/banner?type=2'
  })
}

function getSongList(cat, limit) {
  return iceRequest.get({
    url: '/top/playlist',
    data: {
      cat,
      limit
    }
  })
}

function getAllTag() {
  return iceRequest.get({
    url: '/playlist/hot'
  })
}


export {
  getBannerList,
  getSongList,
  getAllTag
}