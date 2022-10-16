import {iceRequest} from './index'

function getBannerList() {
  return iceRequest.get({
    url: '/banner?type=2'
  })
}


export {
  getBannerList
}