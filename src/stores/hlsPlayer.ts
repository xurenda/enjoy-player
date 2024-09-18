import { defineStore } from 'pinia'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import type { VideoDetailResponse } from '@/api/detail'
import useVideoDetailStore from './videoDetail'
import { initRotateAndMirror } from '@/utils/plyr'
import { watchEffect } from 'vue'

export interface PlayerData {
  videoDom: HTMLVideoElement
  player: Plyr
  data: VideoDetailResponse
  hls: Hls | undefined
}

const playerMap = new Map<number, PlayerData>()

const useHlsPlayerStore = defineStore('hlsPlayer', () => {
  const router = useKeepQueryRouter()
  const videoDetailStore = useVideoDetailStore()

  watchEffect(() => {
    const url = videoDetailStore.curEpisode.url
    const id = videoDetailStore.data?.vod_id
    if (id && url) {
      const playerData = playerMap.get(id)
      if (playerData) {
        loadUrlForVideo(playerData, videoDetailStore.curEpisode)
        playerData.videoDom.oncanplay = () => {
          playerData.player.play()
        }
      }
    }
  })

  const initPlayer = (data: VideoDetailResponse) => {
    if (!playerMap.has(data.vod_id)) {
      const playerData = createPlayer({ ...data })
      loadUrlForVideo(playerData, videoDetailStore.curEpisode)
      playerData.videoDom.onleavepictureinpicture = () => {
        if (!playerMap.has(data.vod_id)) {
          return
        }
        const id = playerData.data.vod_id
        if (videoDetailStore.data?.vod_id !== id) {
          router.push({ name: 'videoDetail', params: { id } })
        }
      }
      playerData.videoDom.onended = () => {
        if (typeof playerData.data.epIdx !== 'number') {
          return
        }
        const id = playerData.data.vod_id
        if (videoDetailStore.data?.vod_id !== id) {
          return
        }
        const next = playerData.data.vod_play_url[playerData.data.epIdx + 1]
        if (!next) {
          return
        }
        videoDetailStore.changeEpisode(playerData.data.epIdx + 1)
      }
      playerMap.set(data.vod_id, playerData)
    }
    return playerMap.get(data.vod_id)!
  }

  const destroyPlayer = (id: number) => {
    const playerData = playerMap.get(id)
    if (playerData && !playerData.player.pip) {
      if (playerData.hls) {
        playerData.hls.stopLoad()
        playerData.hls.destroy()
      }
      playerData.player.destroy()
      playerMap.delete(id)
    }
  }

  return {
    initPlayer,
    destroyPlayer,
  }
})

export default useHlsPlayerStore

const plyrOption: Plyr.Options = {
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
}

function createPlayer(data: VideoDetailResponse): PlayerData {
  const videoContainerDom = document.createElement('div')
  const videoDom = document.createElement('video')
  videoDom.poster = data.vod_pic
  videoContainerDom.appendChild(videoDom)
  const player = new Plyr(videoDom, plyrOption)
  initRotateAndMirror(player)
  let hls: Hls | undefined

  // videoDom.onenterpictureinpicture = () => {}

  return {
    videoDom,
    player,
    data,
    hls,
  }
}

function loadUrlForVideo(data: PlayerData, epData: { name?: string; url?: string; idx: number }) {
  if (!epData.url) {
    return
  }
  data.data.epIdx = epData.idx
  if (data.hls) {
    data.hls.stopLoad()
    data.hls.destroy()
  }
  if (Hls.isSupported()) {
    data.hls = new Hls()
    // hls.on(Hls.Events.ERROR, (event, data) => {
    //   console.log('~~~~~!Hls.Events.ERROR', event, data)
    // })
    data.hls.loadSource(epData.url)
    data.hls.attachMedia(data.videoDom)
  } else if (data.videoDom.canPlayType('application/vnd.apple.mpegurl')) {
    data.videoDom.src = epData.url
  }
}
