# 微信小程序 - iceMusic

## 1. 项目介绍

### 1.1 技术栈

微信小程序 + vant 组件库 + hy-event-store 状态管理库 + underscore

### 1.2 页面构成及效果

- 音乐首页
- 视频列表
- 视频详情
- 搜索页面
- 搜索列表
- 搜索联想
- 歌单列表
- 榜单列表
- 播放详情
- 效果展示

  ![1666588402341](image/README/1666588402341.png)

  ![1666588425726](image/README/1666588425726.png)

  ![1666588433167](image/README/1666588433167.png)

### 1.3 文件夹目录

├─assets
│ └─images
│ ├─icons
│ │ arrow-left.png
│ │ arrow-right.png
│ │ favor_icon.png
│ │ play_icon.png
│ │ search_icon.png
│ │ share_icon.png
│ │ sq_icon.png
│ │
│ ├─music
│ │ pause_icon.png
│ │ playlist_icon.png
│ │ play_icon.png
│ │
│ ├─profile
│ │ avatar_placeholder.png
│ │ favor.png
│ │ history.png
│ │ like.png
│ │ music.png
│ │
│ └─tabbar
│ music_active.png
│ music_normal.png
│ profile_active.png
│ profile_normal.png
│ video_active.png
│ video_normal.png
│
├─components
│ ├─area-header
│ │ area-header.js
│ │ area-header.json
│ │ area-header.wxml
│ │ area-header.wxss
│ │
│ ├─nav-bar
│ │ nav-bar.js
│ │ nav-bar.json
│ │ nav-bar.wxml
│ │ nav-bar.wxss
│ │
│ ├─peak-area
│ │ peak-area.js
│ │ peak-area.json
│ │ peak-area.wxml
│ │ peak-area.wxss
│ │
│ ├─song-area
│ │ song-area.js
│ │ song-area.json
│ │ song-area.wxml
│ │ song-area.wxss
│ │
│ ├─song-info
│ │ song-info.js
│ │ song-info.json
│ │ song-info.wxml
│ │ song-info.wxss
│ │
│ ├─song-item
│ │ song-item.js
│ │ song-item.json
│ │ song-item.wxml
│ │ song-item.wxss
│ │
│ ├─song-top
│ │ song-top.js
│ │ song-top.json
│ │ song-top.wxml
│ │ song-top.wxss
│ │
│ ├─video-item
│ │ video-item.js
│ │ video-item.json
│ │ video-item.wxml
│ │ video-item.wxss
│ │
│ └─video-recom
│ video-recom.js
│ video-recom.json
│ video-recom.wxml
│ video-recom.wxss
├─packagePlayer
│ ├─assets
│ │ └─images
│ │ └─player
│ │ play_music.png
│ │ play_next.png
│ │ play_order.png
│ │ play_pause.png
│ │ play_prev.png
│ │ play_random.png
│ │ play_repeat.png
│ │ play_resume.png
│ │
│ └─pages
│ └─music-player
│ music-player.js
│ music-player.json
│ music-player.wxml
│ music-player.wxss
│
├─pages
│ ├─detail-menu
│ │ detail-menu.js
│ │ detail-menu.json
│ │ detail-menu.wxml
│ │ detail-menu.wxss
│ │
│ ├─detail-video
│ │ detail-video.js
│ │ detail-video.json
│ │ detail-video.wxml
│ │ detail-video.wxss
│ │
│ ├─home-music
│ │ home-music.js
│ │ home-music.json
│ │ home-music.wxml
│ │ home-music.wxss
│ │
│ ├─home-video
│ │ home-video.js
│ │ home-video.json
│ │ home-video.wxml
│ │ home-video.wxss
│ │
│ ├─song-list
│ │ song-list.js
│ │ song-list.json
│ │ song-list.wxml
│ │ song-list.wxss
│ │
│ └─song-search
│ song-search.js
│ song-search.json
│ song-search.wxml
│ song-search.wxss
│
├─service
│ index.js
│ music.js
│ player.js
│ search.js
│ video.js
│
├─store
│ index.js
│ peakRank.js
│ playerList.js
│ recomSong.js
│
└─utils
format.wxs
parse-lyricString.js
│ .eslintrc.js
│ .gitignore
│ 1.txt
│ app.js
│ app.json
│ app.wxss
│ package.json
│ project.config.json
│ project.private.config.json
│ README.md
│ sitemap.json
│ yarn.lock
