function parseLyricString(lyrStr) {
  let lyricArr = []
  let lyrStrArr = lyrStr.split("\n")
  let lyricReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  for (let lyr of lyrStrArr) {
    const strResult = lyricReg.exec(lyr)
    if(!strResult) continue;

    const min = strResult[1] * 60 * 1000
    const sec = strResult[2] * 1000
    const mill = strResult[3].length === 3 ? strResult[3] * 1 : strResult[3] * 10
    const time = min + sec + mill
    const text = lyr.replace(lyricReg, "")

    if (text.trim()) {
      lyricArr.push({time,text})
    }
  }

  return lyricArr
}

export default parseLyricString