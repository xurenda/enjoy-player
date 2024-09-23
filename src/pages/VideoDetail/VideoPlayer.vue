<template>
  <div ref="playerContainer" class="relative flex w-full justify-center border-l border-t border-color-border">
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/60 px-3 py-2 text-base tracking-wider text-white opacity-0 duration-100"
      :class="{ 'opacity-100': showVolume }"
    >
      <i class="iconfont icon-volume mr-1"></i>
      <span>{{ volume }}%</span>
    </div>
  </div>
  <contextHolder />
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useHlsPlayerStore from '@/stores/hlsPlayer'
import usePlayerSettingsStore from '@/stores/settings/player'
import { notification } from 'ant-design-vue'
import Hls, { Events, type ErrorData } from 'hls.js'
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const { t } = useI18n()
const [notificationApi, contextHolder] = notification.useNotification()
const playerContainer = useTemplateRef<HTMLDivElement>('playerContainer')
const hlsPlayerStore = useHlsPlayerStore()
const playerSettingsStore = usePlayerSettingsStore()
const playerData = hlsPlayerStore.initPlayer(data)
const volume = ref(Math.round(playerData.player.volume * 100))
const showVolume = ref(false)

const onPlayerError = (_event: Events.ERROR, data: ErrorData) => {
  if (data.details && data.details === 'manifestLoadError') {
    notificationApi.error({
      key: 'playerError',
      message: t('videoInfo.errorTitle'),
      description: t('videoInfo.errorContent'),
      duration: 6,
    })
  }
}

let timer: number | null = null
const onVolumeChange = () => {
  const v = Math.round(playerData.player.volume * 100)
  volume.value = v
  showVolume.value = true
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    showVolume.value = false
    timer = null
  }, 1000)
}

onMounted(() => {
  const container = playerData.player.elements.container!
  container.style.width = '100%'
  container.style.maxHeight = 'calc(100vh - 134px)'
  container.style.aspectRatio = playerSettingsStore.ratio.replace(':', '/')
  playerContainer.value!.appendChild(container)
  playerData.player.on('volumechange', onVolumeChange)
  playerData.hls?.on(Hls.Events.ERROR, onPlayerError)
})

onBeforeUnmount(() => {
  playerData.player.off('volumechange', onVolumeChange)
  playerData.hls?.off(Hls.Events.ERROR, onPlayerError)
  hlsPlayerStore.destroyPlayer(playerData.data.vod_id)
})

watch(
  () => playerSettingsStore.ratio,
  () => {
    const container = playerData.player.elements.container
    if (!container) return
    container.style.aspectRatio = playerSettingsStore.ratio.replace(':', '/')
  },
)

defineExpose({ playerData })
</script>
