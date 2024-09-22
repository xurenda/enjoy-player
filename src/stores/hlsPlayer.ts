import { defineStore } from 'pinia'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import type { VideoDetailResponse } from '@/api/detail'
import useVideoDetailStore from './videoDetail'
import { initRotateAndMirror } from '@/utils/plyr'
import { watch } from 'vue'
import { getPlyrI18n } from '@/i18n'
import useBasicSettingsStore from './settings/basic'
import usePlayerSettingsStore from './settings/player'

export interface PlayerData {
  videoDom: HTMLVideoElement
  player: Plyr
  data: VideoDetailResponse
  hls: Hls | undefined
}

export const playerMap = new Map<number, PlayerData>()

const useHlsPlayerStore = defineStore('hlsPlayer', () => {
  const router = useKeepQueryRouter()
  const videoDetailStore = useVideoDetailStore()
  const basicSettingsStore = useBasicSettingsStore()
  const playerSettingsStore = usePlayerSettingsStore()

  watch(
    () => videoDetailStore.curEpisode,
    () => {
      const url = videoDetailStore.curEpisode.url
      const id = videoDetailStore.data?.vod_id
      if (id && url) {
        const playerData = playerMap.get(id)
        if (playerData) {
          if (playerData.data.leavePip) {
            playerData.data.leavePip = false
            return
          }
          loadUrlForVideo(playerData, videoDetailStore.curEpisode)
          playerData.videoDom.oncanplay = () => {
            playerData.player.play()
          }
        }
      }
    },
  )

  const plyrOptions: Plyr.Options = {
    i18n: getPlyrI18n(basicSettingsStore.locale),
    // loadSprite: false,
    seekTime: playerSettingsStore.seekStep,
    volume: 0.2,
    keyboard: { focused: true, global: true },
    tooltips: { controls: playerSettingsStore.showTooltip, seek: true },
    invertTime: playerSettingsStore.invertTime,
    toggleInvert: true,
    speed: { selected: 1, options: playerSettingsStore.speed },
  }

  const initPlayer = (data: VideoDetailResponse) => {
    if (!playerMap.has(data.vod_id)) {
      const playerData = createPlayer({ ...data }, plyrOptions)
      loadUrlForVideo(playerData, videoDetailStore.curEpisode)
      playerData.videoDom.onenterpictureinpicture = () => {
        playerData.data.leavePip = false
      }
      playerData.videoDom.onleavepictureinpicture = () => {
        if (!playerMap.has(data.vod_id)) {
          return
        }
        const id = playerData.data.vod_id
        if (videoDetailStore.data?.vod_id !== id) {
          playerData.data.leavePip = true
          router.push({ name: 'videoDetail', params: { id }, query: { ep: playerData.data.epIdx } })
        }
      }
      playerData.videoDom.onended = () => {
        switch (playerSettingsStore.playMode) {
          case 'pause':
            break
          case 'loop':
            playerData.player.play()
            break
          case 'next': {
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
            break
          }
        }
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

function createPlayer(data: VideoDetailResponse, plyrOptions: Plyr.Options): PlayerData {
  const videoContainerDom = document.createElement('div')
  const videoDom = document.createElement('video')
  if (data.vod_pic) {
    videoDom.poster = data.vod_pic
  }
  videoContainerDom.appendChild(videoDom)
  const player = new Plyr(videoDom, plyrOptions)
  initRotateAndMirror(player)
  let hls: Hls | undefined

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
    data.hls.loadSource(epData.url)
    data.hls.attachMedia(data.videoDom)
  } else if (data.videoDom.canPlayType('application/vnd.apple.mpegurl')) {
    data.videoDom.src = epData.url
  }
}
