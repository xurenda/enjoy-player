<template>
  <div ref="playerContainer" class="flex w-full justify-center"></div>
</template>

<script setup lang="ts">
import type { VideoDetailResponse } from '@/api/detail'
import useHlsPlayerStore from '@/stores/hlsPlayer'
import usePlayerSettingsStore from '@/stores/settings/player'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

const { data } = defineProps<{
  data: VideoDetailResponse
}>()

const playerContainer = useTemplateRef<HTMLDivElement>('playerContainer')
const hlsPlayerStore = useHlsPlayerStore()
const playerSettingsStore = usePlayerSettingsStore()
const playerData = hlsPlayerStore.initPlayer(data)

onMounted(() => {
  const container = playerData.player.elements.container!
  container.style.width = '100%'
  container.style.maxHeight = 'calc(100vh - 131px)'
  container.style.aspectRatio = playerSettingsStore.ratio.replace(':', '/')
  playerContainer.value!.appendChild(container)
})

onBeforeUnmount(() => {
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
