import { defineStore } from 'pinia'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import useKeepQueryRouter from '@/hooks/useKeepQueryRouter'
import type { VideoDetailResponse } from '@/api/detail'
import useVideoDetailStore from './videoDetail'
import { initRotateAndMirror } from '@/utils/plyr'
import { watchEffect } from 'vue'
import { getPlyrI18n } from '@/i18n'
import useBasicSettingsStore from './settings/basic'
import usePlayerSettingsStore from './settings/player'

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
  const basicSettingsStore = useBasicSettingsStore()
  const playerSettingsStore = usePlayerSettingsStore()

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

  const plyrOptions: Plyr.Options = {
    i18n: getPlyrI18n(basicSettingsStore.locale),
    // loadSprite: false,
    seekTime: playerSettingsStore.seekTime,
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

function createPlayer(data: VideoDetailResponse, plyrOptions: Plyr.Options): PlayerData {
  const videoContainerDom = document.createElement('div')
  const videoDom = document.createElement('video')
  videoDom.poster = data.vod_pic
  videoContainerDom.appendChild(videoDom)
  const player = new Plyr(videoDom, plyrOptions)
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
