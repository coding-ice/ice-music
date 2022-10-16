import {iceRequest} from './index'

function getTopMv(limit = 30, offset = 0) {
  return iceRequest.get({ 
    url: '/top/mv',
    data: {
      limit,
      offset
    }
  })
}

function getMvVideo(id) {
  return iceRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

function getMvInfo(mvid) {
  return iceRequest.get({
    url: '/mv/detail',
    data: {
      mvid
    }
  })
}

function getMvRelatedVideo(id) {
  return iceRequest.get({
    url: '/related/allvideo',
    data: {
      id
    }
  })
}


export {
  getTopMv,
  getMvVideo,
  getMvInfo,
  getMvRelatedVideo
}