import {iceRequest} from './index'

function getSongDetail(ids) {
  return iceRequest.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}

function getSongLyric(id) {
  return iceRequest.get({
    url: '/lyric',
    data: {
      id
    }
  })
}

export {
  getSongDetail,
  getSongLyric
}