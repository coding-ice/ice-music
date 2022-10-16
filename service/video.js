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


export {
  getTopMv,
  getMvVideo
}