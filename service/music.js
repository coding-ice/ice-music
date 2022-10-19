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

function getRecomSongList(id = 3778678) {
  return iceRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export {
  getBannerList,
  getSongList,
  getAllTag,
  getRecomSongList
}