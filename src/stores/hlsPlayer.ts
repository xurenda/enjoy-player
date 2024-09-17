import { defineStore } from 'pinia'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import type { VideoDetailResponse } from '@/api/detail'
import useVideoDetailStore from './videoDetail'
import { initRotateAndMirror } from '@/utils/plyr'

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

  const initPlayer = (data: VideoDetailResponse) => {
    if (!playerMap.has(data.vod_id)) {
      const playerData = createPlayer({ ...data })
      playerMap.set(data.vod_id, playerData)
      playerData.videoDom.onleavepictureinpicture = () => {
        if (!playerMap.has(data.vod_id)) {
          return
        }
        const id = playerData.data.vod_id
        if (videoDetailStore.data?.vod_id !== id) {
          router.push({ name: 'videoDetail', params: { id } })
        }
      }
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
    'rotate',
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
  videoContainerDom.appendChild(videoDom)
  const player = new Plyr(videoDom, plyrOption)
  initRotateAndMirror(player)
  let hls: Hls | undefined

  // videoDom.onenterpictureinpicture = () => {}

  if (Hls.isSupported()) {
    hls = new Hls()
    // hls.on(Hls.Events.ERROR, (event, data) => {
    //   console.log('~~~~~!Hls.Events.ERROR', event, data)
    // })
    hls.loadSource(data.vod_play_url[0].url)
    hls.attachMedia(videoDom)
  } else if (videoDom.canPlayType('application/vnd.apple.mpegurl')) {
    videoDom.src = data.vod_play_url[0].url
  }

  return {
    videoDom,
    player,
    data,
    hls,
  }
}
